
const db = require('../database/db');

// GET RENTAL DETAILS USING SQL JOIN
const getRentalDetails = (req, res) => {
    const sql = `
        SELECT
            rentals.id AS rental_id,
            trekkers.name AS trekker_name,
            trekkers.email AS trekker_email,
            trekkers.phone AS trekker_phone,
            tents.tent_code,
            tents.tent_name,
            tents.brand,
            tents.size,
            tents.price,
            rentals.rental_date,
            rentals.return_date,
            rentals.status
        FROM rentals
        INNER JOIN trekkers
            ON rentals.trekker_id = trekkers.id
        INNER JOIN tents
            ON rentals.tent_id = tents.id
        ORDER BY rentals.id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch rental details',
                error: err.message
            });
        }

        res.json({
            success: true,
            total: rows.length,
            message: 'Rental details fetched successfully!',
            rentals: rows
        });
    });
};

module.exports = { getRentalDetails };
