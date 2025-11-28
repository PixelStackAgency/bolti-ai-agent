const express = require('express');
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/plans', billingController.getPlans);
router.post('/subscribe', authMiddleware, billingController.createSubscription);
router.get('/subscription', authMiddleware, billingController.getSubscription);
router.post('/webhook/razorpay', billingController.handleRazorpayWebhook);
router.post('/cancel', authMiddleware, billingController.cancelSubscription);

module.exports = router;
