
const db = require('../database/db');

// GET LATEST 10 AUDIT LOGS
const getLatestAuditLogs = (req, res) => {
    db.all(
        `SELECT * FROM audit_logs
         ORDER BY id DESC
         LIMIT 10`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch audit logs',
                    error: err.message
                });
            }

            res.json({
                success: true,
                total: rows.length,
                message: 'Latest 10 audit logs fetched successfully!',
                auditLogs: rows
            });
        }
    );
};

module.exports = { getLatestAuditLogs };
