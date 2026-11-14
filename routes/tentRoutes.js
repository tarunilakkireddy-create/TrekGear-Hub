
const express = require('express');
const router = express.Router();

const {
    addTent,
    getAllTents,
    getTentById,
    updateTent,
    deleteTent
} = require('../controllers/tentController');

const { validateTent } = require('../controllers/validation');

// POST - Add a tent with validation
router.post('/', validateTent, addTent);

// GET - Get all tents or search by size
router.get('/', getAllTents);

// GET - Get one tent by ID
router.get('/:id', getTentById);

// PUT - Update a tent with validation
router.put('/:id', validateTent, updateTent);

// DELETE - Delete a tent
router.delete('/:id', deleteTent);

module.exports = router;
