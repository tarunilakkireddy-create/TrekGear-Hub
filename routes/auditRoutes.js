
const express = require('express');
const router = express.Router();

const {
    getLatestAuditLogs
} = require('../controllers/auditController');

// GET latest 10 audit logs
router.get('/', getLatestAuditLogs);

module.exports = router;
