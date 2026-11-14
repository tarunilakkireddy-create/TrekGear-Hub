

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'trekgear.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('SQLite Database Connected Successfully!');
    }
});

// Database initialization and migration
db.ready = new Promise((resolve, reject) => {

    db.serialize(() => {

        db.run('PRAGMA foreign_keys = ON');

        db.run(`
            CREATE TABLE IF NOT EXISTS trekkers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS tents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tent_code TEXT,
                tent_name TEXT NOT NULL,
                brand TEXT NOT NULL,
                size TEXT NOT NULL DEFAULT 'Medium',
                capacity INTEGER NOT NULL,
                price REAL NOT NULL,
                location TEXT NOT NULL,
                availability TEXT DEFAULT 'Available',
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS rentals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trekker_id INTEGER NOT NULL,
                tent_id INTEGER NOT NULL,
                rental_date TEXT NOT NULL,
                return_date TEXT,
                status TEXT DEFAULT 'Active',
                FOREIGN KEY (trekker_id) REFERENCES trekkers(id),
                FOREIGN KEY (tent_id) REFERENCES tents(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                entity TEXT NOT NULL,
                record_id INTEGER,
                details TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check existing tent columns
        db.all('PRAGMA table_info(tents)', (err, columns) => {

            if (err) {
                return reject(err);
            }

            const existingColumns = columns.map(col => col.name);

            const migrations = [];

            if (!existingColumns.includes('tent_code')) {
                migrations.push(
                    "ALTER TABLE tents ADD COLUMN tent_code TEXT"
                );
            }

            if (!existingColumns.includes('size')) {
                migrations.push(
                    "ALTER TABLE tents ADD COLUMN size TEXT NOT NULL DEFAULT 'Medium'"
                );
            }

            const runMigration = (index) => {

                if (index >= migrations.length) {

                    db.run(`
                        CREATE UNIQUE INDEX IF NOT EXISTS
                        idx_tents_tent_code
                        ON tents(tent_code)
                    `, (indexErr) => {

                        if (indexErr) return reject(indexErr);

                        // Generate codes for existing tents
                        db.all(
                            'SELECT id FROM tents WHERE tent_code IS NULL',
                            (selectErr, rows) => {

                                if (selectErr) return reject(selectErr);

                                const updateNext = (i) => {
                                    if (i >= rows.length) {
                                        console.log('All database tables initialized!');
                                        console.log('Database migration completed!');
                                        return resolve();
                                    }

                                    const code = `TNT-${String(rows[i].id).padStart(4, '0')}`;

                                    db.run(
                                        'UPDATE tents SET tent_code = ? WHERE id = ?',
                                        [code, rows[i].id],
                                        (updateErr) => {
                                            if (updateErr) return reject(updateErr);
                                            updateNext(i + 1);
                                        }
                                    );
                                };

                                updateNext(0);
                            }
                        );
                    });

                    return;
                }

                db.run(migrations[index], (migrationErr) => {
                    if (migrationErr) return reject(migrationErr);
                    runMigration(index + 1);
                });
            };

            runMigration(0);
        });
    });
});

module.exports = db;
