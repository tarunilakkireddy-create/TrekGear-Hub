
const express = require('express');
const cors = require('cors');

const db = require('./database/db');
const tentRoutes = require('./routes/tentRoutes');
const auditRoutes = require('./routes/auditRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const trekkerRoutes = require('./routes/trekkerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/tents', tentRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/trekkers', trekkerRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to TrekGear Hub Backend!');
});

// Test database connection
app.get('/api/test', (req, res) => {
    db.get('SELECT COUNT(*) AS total FROM tents', (err, row) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: 'Backend and SQLite Database Connected Successfully!',
            totalTents: row.total
        });
    });
});

// Get database tables
app.get('/api/tables', (req, res) => {
    db.all(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                tables: rows
            });
        }
    );
});

const PORT = process.env.PORT || 5000;

db.ready.then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log('TrekGear Hub Backend Started!');
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Database initialization failed:', err.message);
});
