const Lead = require('../models/Lead');
const { v4: uuidv4 } = require('uuid');

exports.getLeads = async (req, res) => {
  try {
    const { tenantId } = req;
    const { status, limit = 100, offset = 0 } = req.query;
    
    const query = { tenantId };
    if (status) query.status = status;
    
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Lead.countDocuments(query);
    
    res.json({
      leads,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLead = async (req, res) => {
  try {
    const { tenantId } = req;
    const { leadId } = req.params;
    
    const lead = await Lead.findOne({ tenantId, _id: leadId });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const { tenantId } = req;
    const leadData = req.body;
    
    const lead = new Lead({
      tenantId,
      callId: leadData.callId || `call_${uuidv4().substring(0, 12)}`,
      ...leadData,
      status: leadData.status || 'new'
    });
    
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { tenantId } = req;
    const { leadId } = req.params;
    const updateData = req.body;
    
    const lead = await Lead.findOneAndUpdate(
      { tenantId, _id: leadId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkCreateLeads = async (req, res) => {
  try {
    const { tenantId } = req;
    const { leads } = req.body;
    
    if (!Array.isArray(leads)) {
      return res.status(400).json({ error: 'Leads must be an array' });
    }
    
    const formattedLeads = leads.map(lead => ({
      tenantId,
      callId: lead.callId || `call_${uuidv4().substring(0, 12)}`,
      ...lead,
      status: lead.status || 'new'
    }));
    
    const result = await Lead.insertMany(formattedLeads);
    
    res.json({
      created: result.length,
      leads: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
