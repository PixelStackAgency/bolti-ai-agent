const Call = require('../models/Call');
const Lead = require('../models/Lead');
const Ticket = require('../models/Ticket');
const { v4: uuidv4 } = require('uuid');

exports.getCallHistory = async (req, res) => {
  try {
    const { tenantId } = req;
    const { limit = 50, offset = 0 } = req.query;
    
    const calls = await Call.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Call.countDocuments({ tenantId });
    
    res.json({
      calls,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCallDetail = async (req, res) => {
  try {
    const { tenantId } = req;
    const { callId } = req.params;
    
    const call = await Call.findOne({ tenantId, callId });
    
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }
    
    res.json(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { tenantId } = req;
    const { period = '30d' } = req.query;
    
    const startDate = new Date();
    if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    if (period === '90d') startDate.setDate(startDate.getDate() - 90);
    
    const totalCalls = await Call.countDocuments({ tenantId, createdAt: { $gte: startDate } });
    const completedCalls = await Call.countDocuments({ 
      tenantId, 
      status: 'completed', 
      createdAt: { $gte: startDate } 
    });
    const escalatedCalls = await Call.countDocuments({ 
      tenantId, 
      escalated: true, 
      createdAt: { $gte: startDate } 
    });
    
    const resolvedByAI = await Call.countDocuments({ 
      tenantId, 
      resolvedByAI: true, 
      createdAt: { $gte: startDate } 
    });
    
    const totalLeads = await Lead.countDocuments({ tenantId, createdAt: { $gte: startDate } });
    const convertedLeads = await Lead.countDocuments({ 
      tenantId, 
      status: 'converted', 
      createdAt: { $gte: startDate } 
    });
    
    const totalTickets = await Ticket.countDocuments({ tenantId, createdAt: { $gte: startDate } });
    const resolvedTickets = await Ticket.countDocuments({ 
      tenantId, 
      status: 'resolved', 
      createdAt: { $gte: startDate } 
    });
    
    res.json({
      period,
      calls: {
        total: totalCalls,
        completed: completedCalls,
        escalated: escalatedCalls,
        resolvedByAI: resolvedByAI,
        aiResolutionRate: totalCalls > 0 ? Math.round((resolvedByAI / totalCalls) * 100) : 0
      },
      leads: {
        total: totalLeads,
        converted: convertedLeads,
        conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0
      },
      tickets: {
        total: totalTickets,
        resolved: resolvedTickets,
        resolutionRate: totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logCall = async (req, res) => {
  try {
    const { tenantId } = req;
    const callData = req.body;
    
    const call = new Call({
      tenantId,
      callId: `call_${uuidv4().substring(0, 12)}`,
      ...callData,
      createdAt: new Date()
    });
    
    await call.save();
    res.json(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
