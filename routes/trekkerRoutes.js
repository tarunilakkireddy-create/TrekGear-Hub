
const express = require('express');
const router = express.Router();

const db = require('../database/db');

// GET - Get all trekkers
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM trekkers ORDER BY id DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch trekkers',
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                total: rows.length,
                trekkers: rows
            });
        }
    );
});

module.exports = router;
