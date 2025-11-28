const express = require('express');
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, leadController.getLeads);
router.get('/:leadId', authMiddleware, leadController.getLead);
router.post('/', authMiddleware, leadController.createLead);
router.post('/bulk', authMiddleware, leadController.bulkCreateLeads);
router.patch('/:leadId', authMiddleware, leadController.updateLead);

module.exports = router;
