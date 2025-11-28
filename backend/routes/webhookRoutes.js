const express = require('express');
const inboundWebhook = require('../telephony/inbound-webhook');

const router = express.Router();

// Exotel inbound webhook
router.post('/inbound', inboundWebhook.handleInboundWebhook);

// Exotel outbound callback
router.post('/outbound-callback', inboundWebhook.handleOutboundCallback);

// Escalation handler
router.post('/escalation', inboundWebhook.handleEscalation);

module.exports = router;
