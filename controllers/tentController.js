
const db = require('../database/db');

// Helper function to save audit logs
const saveAuditLog = (action, entity, recordId, details, callback) => {
    db.run(
        `INSERT INTO audit_logs (action, entity, record_id, details)
         VALUES (?, ?, ?, ?)`,
        [action, entity, recordId, JSON.stringify(details)],
        callback
    );
};

// ADD TENT
const addTent = (req, res) => {
    const {
        tent_name,
        brand,
        size,
        capacity,
        price,
        location,
        availability,
        description
    } = req.body;

    db.run(
        `INSERT INTO tents
        (tent_name, brand, size, capacity, price, location, availability, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            tent_name,
            brand,
            size,
            capacity,
            price,
            location,
            availability || 'Available',
            description || ''
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to add tent',
                    error: err.message
                });
            }

            const tentId = this.lastID;
            const tentCode = `TNT-${String(tentId).padStart(4, '0')}`;

            db.run(
                'UPDATE tents SET tent_code = ? WHERE id = ?',
                [tentCode, tentId],
                (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({
                            success: false,
                            message: 'Tent added but code update failed',
                            error: updateErr.message
                        });
                    }

                    saveAuditLog(
                        'ADD',
                        'TENT',
                        tentId,
                        { tent_name, brand, size, capacity, price, location },
                        (logErr) => {
                            res.status(201).json({
                                success: true,
                                message: 'Tent added successfully!',
                                tentId,
                                tentCode,
                                auditLogSaved: !logErr,
                                auditLogError: logErr ? logErr.message : undefined
                            });
                        }
                    );
                }
            );
        }
    );
};

// GET ALL TENTS / SEARCH BY SIZE
const getAllTents = (req, res) => {
    const size = req.query.size;

    let sql = 'SELECT * FROM tents';
    let params = [];

    if (size) {
        sql += ' WHERE LOWER(size) = LOWER(?)';
        params.push(size);
    }

    sql += ' ORDER BY id DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            total: rows.length,
            searchSize: size || 'All',
            tents: rows
        });
    });
};

// GET TENT BY ID
const getTentById = (req, res) => {
    db.get(
        'SELECT * FROM tents WHERE id = ?',
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: 'Tent not found'
                });
            }

            res.json({
                success: true,
                tent: row
            });
        }
    );
};

// UPDATE TENT
const updateTent = (req, res) => {
    const {
        tent_name,
        brand,
        size,
        capacity,
        price,
        location,
        availability,
        description
    } = req.body;

    db.run(
        `UPDATE tents SET
        tent_name = ?,
        brand = ?,
        size = ?,
        capacity = ?,
        price = ?,
        location = ?,
        availability = ?,
        description = ?
        WHERE id = ?`,
        [
            tent_name,
            brand,
            size,
            capacity,
            price,
            location,
            availability,
            description,
            req.params.id
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Tent not found'
                });
            }

            const tentId = Number(req.params.id);

            saveAuditLog(
                'UPDATE',
                'TENT',
                tentId,
                { tent_name, brand, size, capacity, price, location },
                (logErr) => {
                    res.json({
                        success: true,
                        message: 'Tent updated successfully!',
                        auditLogSaved: !logErr,
                        auditLogError: logErr ? logErr.message : undefined
                    });
                }
            );
        }
    );
};

// DELETE TENT
const deleteTent = (req, res) => {
    const tentId = Number(req.params.id);

    db.run(
        'DELETE FROM tents WHERE id = ?',
        [tentId],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Tent not found'
                });
            }

            saveAuditLog(
                'DELETE',
                'TENT',
                tentId,
                { message: 'Tent deleted' },
                (logErr) => {
                    res.json({
                        success: true,
                        message: 'Tent deleted successfully!',
                        auditLogSaved: !logErr,
                        auditLogError: logErr ? logErr.message : undefined
                    });
                }
            );
        }
    );
};

module.exports = {
    addTent,
    getAllTents,
    getTentById,
    updateTent,
    deleteTent
};
