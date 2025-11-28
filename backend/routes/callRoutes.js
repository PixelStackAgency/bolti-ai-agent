const express = require('express');
const callController = require('../controllers/callController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/history', authMiddleware, callController.getCallHistory);
router.get('/:callId', authMiddleware, callController.getCallDetail);
router.get('/analytics/:period', authMiddleware, callController.getAnalytics);
router.post('/log', authMiddleware, callController.logCall);

module.exports = router;
