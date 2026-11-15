
const express = require('express');
const router = express.Router();

const { getRentalDetails } = require('../controllers/rentalController');

// Get rental details using JOIN
router.get('/', getRentalDetails);

module.exports = router;
