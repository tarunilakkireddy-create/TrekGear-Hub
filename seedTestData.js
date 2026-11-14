
const db = require('./database/db');

db.ready.then(() => {
    const email = `test${Date.now()}@example.com`;

    // Insert a sample trekker
    db.run(
        `INSERT INTO trekkers (name, email, phone)
         VALUES (?, ?, ?)`,
        ['Test Trekker', email, '9876543210'],
        function (err) {
            if (err) {
                console.log('Trekker insertion failed:', err.message);
                return;
            }

            const trekkerId = this.lastID;

            // Find an existing tent
            db.get(
                'SELECT id FROM tents LIMIT 1',
                [],
                (err, tent) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    const createRental = (tentId) => {
                        db.run(
                            `INSERT INTO rentals
                            (trekker_id, tent_id, rental_date, return_date, status)
                            VALUES (?, ?, ?, ?, ?)`,
                            [
                                trekkerId,
                                tentId,
                                '2026-11-14',
                                '2026-11-16',
                                'Active'
                            ],
                            function (err) {
                                if (err) {
                                    console.log('Rental insertion failed:', err.message);
                                    return;
                                }

                                console.log('Sample trekker added!');
                                console.log('Sample rental added!');
                                console.log('Trekker ID:', trekkerId);
                                console.log('Tent ID:', tentId);
                                console.log('Now test GET /api/rentals');
                                db.close();
                            }
                        );
                    };

                    if (tent) {
                        createRental(tent.id);
                    } else {
                        console.log('No tents found. Add a tent before creating a rental.');
                        db.close();
                    }
                }
            );
        }
    );
}).catch(err => {
    console.log('Database error:', err.message);
});
