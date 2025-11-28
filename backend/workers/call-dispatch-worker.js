const Queue = require('bull');
const redis = require('redis');
const ExotelAdapter = require('./provider-adapter');
const Call = require('../models/Call');
const Lead = require('../models/Lead');
const Tenant = require('../models/Tenant');
const { v4: uuidv4 } = require('uuid');

// Initialize Redis connection
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Create call queue
const callQueue = new Queue('calls', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Process call jobs
callQueue.process(10, async (job) => {
  const { tenantId, toNumber, fromNumber, campaignId } = job.data;

  console.log(`Processing call job: ${job.id} to ${toNumber}`);

  try {
    // Get tenant
    const tenant = await Tenant.findOne({ tenantId });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Check call minutes limit
    const subscription = await require('../models/Subscription').findOne({ tenantId });
    if (subscription && subscription.usedCallMinutes >= subscription.monthlyCallMinutes) {
      throw new Error('Monthly call minutes limit reached');
    }

    // Initialize Exotel adapter
    const exotel = new ExotelAdapter(
      tenant.exotelApiKey,
      tenant.exotelApiToken,
      process.env.EXOTEL_SID || 'your-sid'
    );

    // Make outbound call
    const callResult = await exotel.makeOutboundCall(
      tenant.verifiedNumbers[0]?.number || fromNumber,
      toNumber,
      `${process.env.WEBHOOK_URL || 'http://localhost:3000'}/api/webhooks/outbound-callback`
    );

    if (!callResult.success) {
      throw new Error(callResult.error);
    }

    // Create call record
    const call = new Call({
      tenantId,
      callId: `call_${uuidv4().substring(0, 12)}`,
      exotelCallId: callResult.callId,
      type: 'outbound',
      fromNumber: tenant.verifiedNumbers[0]?.number || fromNumber,
      toNumber,
      status: 'initiated',
      startTime: new Date(),
      campaignId
    });

    await call.save();

    // Create lead
    const lead = new Lead({
      tenantId,
      callId: call.callId,
      phone: toNumber,
      source: 'campaign',
      campaign: campaignId,
      status: 'contacted'
    });

    await lead.save();

    // Update usage
    if (subscription) {
      subscription.usedCallMinutes += 2; // Minimum 2 minute charge per call
      await subscription.save();
    }

    console.log(`Call initiated: ${call.callId}`);

    return {
      success: true,
      callId: call.callId,
      exotelCallId: callResult.callId
    };
  } catch (error) {
    console.error(`Call job error for ${toNumber}:`, error.message);
    throw error;
  }
});

// Monitor queue events
callQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

callQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

/**
 * Queue batch of calls from campaign
 */
exports.queueCampaignCalls = async (tenantId, campaignId, leads) => {
  try {
    const tenant = await Tenant.findOne({ tenantId });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const jobs = [];

    for (const lead of leads) {
      const job = await callQueue.add(
        {
          tenantId,
          toNumber: lead.phone,
          fromNumber: tenant.verifiedNumbers[0]?.number,
          campaignId,
          leadData: lead
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          },
          removeOnComplete: true,
          removeOnFail: false,
          priority: lead.priority || 'normal'
        }
      );

      jobs.push(job);
    }

    console.log(`Queued ${jobs.length} calls for campaign ${campaignId}`);

    return {
      queuedJobs: jobs.length,
      campaignId
    };
  } catch (error) {
    console.error('Queue campaign calls error:', error);
    throw error;
  }
};

/**
 * Get queue statistics
 */
exports.getQueueStats = async () => {
  try {
    const counts = await callQueue.getJobCounts();
    const active = await callQueue.getActiveCount();
    const delayed = await callQueue.getDelayedCount();
    const failed = await callQueue.getFailedCount();
    const completed = await callQueue.getCompletedCount();

    return {
      total: counts.active + counts.delayed + counts.failed + counts.completed,
      active,
      delayed,
      failed,
      completed
    };
  } catch (error) {
    console.error('Queue stats error:', error);
    return {};
  }
};

module.exports = exports;
