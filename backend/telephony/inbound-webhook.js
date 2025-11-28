const Call = require('../models/Call');
const Lead = require('../models/Lead');
const Ticket = require('../models/Ticket');
const Tenant = require('../models/Tenant');
const { v4: uuidv4 } = require('uuid');

/**
 * Inbound webhook handler for Exotel
 * Receives webhook from Exotel when call comes in
 */
exports.handleInboundWebhook = async (req, res) => {
  try {
    const {
      CallSid,
      From,
      To,
      CallStatus,
      StartTime,
      EndTime,
      RecordingUrl,
      Data // Custom data with tenantId
    } = req.body;

    const tenantId = Data || req.headers['x-tenant-id'];

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const callId = `call_${uuidv4().substring(0, 12)}`;

    // Find tenant for callback/escalation
    const tenant = await Tenant.findOne({ tenantId });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Log the call
    const call = new Call({
      tenantId,
      callId,
      exotelCallId: CallSid,
      type: 'inbound',
      fromNumber: From,
      toNumber: To,
      status: CallStatus === 'completed' ? 'completed' : 'active',
      recordingUrl: RecordingUrl,
      startTime: new Date(StartTime),
      endTime: EndTime ? new Date(EndTime) : null,
      aiTranscript: `[Inbound call from ${From}]`,
      duration: EndTime ? Math.round((new Date(EndTime) - new Date(StartTime)) / 1000) : 0,
      resolvedByAI: false // AI can resolve on callback
    });

    await call.save();

    // Handle based on call status
    if (CallStatus === 'initiated') {
      // Play consent message
      return res.json({
        action: 'play_message',
        message: `Welcome to ${tenant.companyName}. This call is being recorded for quality assurance. Press 1 to continue.`
      });
    }

    if (CallStatus === 'ringing') {
      // Return IVR menu
      return res.json({
        action: 'ivr_menu',
        prompt: 'Press 1 for Sales, 2 for Support, 3 for Billing',
        timeout: 5,
        retries: 3
      });
    }

    if (CallStatus === 'in-progress') {
      // Create lead from inbound call
      const lead = new Lead({
        tenantId,
        callId,
        name: `Caller ${From.slice(-4)}`,
        phone: From,
        source: 'inbound_call',
        status: 'new'
      });

      await lead.save();

      // Request AI to process call
      return res.json({
        action: 'stream_audio',
        url: 'https://example.com/ai-response-stream',
        prompt: 'How can we help you today?'
      });
    }

    if (CallStatus === 'completed') {
      // Call ended
      // Update lead status
      const lead = await Lead.findOne({ tenantId, callId });
      if (lead && lead.resolvedByAI) {
        lead.status = 'converted';
        await lead.save();
      }
    }

    res.json({
      status: 'received',
      callId
    });
  } catch (error) {
    console.error('Inbound webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Outbound call callback handler
 */
exports.handleOutboundCallback = async (req, res) => {
  try {
    const {
      CallSid,
      From,
      To,
      CallStatus,
      Digits,
      RecordingUrl,
      Duration,
      Data
    } = req.body;

    const tenantId = Data || req.headers['x-tenant-id'];

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    // Find existing call
    let call = await Call.findOne({ exotelCallId: CallSid, tenantId });

    if (!call) {
      call = new Call({
        tenantId,
        callId: `call_${uuidv4().substring(0, 12)}`,
        exotelCallId: CallSid,
        type: 'outbound',
        fromNumber: From,
        toNumber: To,
        status: CallStatus
      });
    }

    // Update call status
    call.status = CallStatus;
    if (RecordingUrl) call.recordingUrl = RecordingUrl;
    if (Duration) call.duration = parseInt(Duration);

    await call.save();

    res.json({
      status: 'processed',
      callId: call.callId
    });
  } catch (error) {
    console.error('Outbound callback error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle escalation to human agent
 */
exports.handleEscalation = async (req, res) => {
  try {
    const { callId, escalationNumber, reason } = req.body;
    const { tenantId } = req;

    const call = await Call.findOne({ tenantId, callId });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Mark as escalated
    call.escalated = true;
    call.escalationNumber = escalationNumber;
    call.status = 'escalated';
    call.aiTranscript += `\n\n[Escalated to human: ${reason}]`;

    await call.save();

    // Create ticket for escalation
    const ticket = new Ticket({
      tenantId,
      callId,
      ticketId: `ticket_${uuidv4().substring(0, 12)}`,
      title: `Call Escalation - ${call.fromNumber}`,
      description: reason,
      customerPhone: call.fromNumber,
      status: 'open',
      priority: 'high',
      category: 'escalation'
    });

    await ticket.save();

    res.json({
      escalated: true,
      ticketId: ticket.ticketId,
      message: `Call escalated to ${escalationNumber}`
    });
  } catch (error) {
    console.error('Escalation error:', error);
    res.status(500).json({ error: error.message });
  }
};
