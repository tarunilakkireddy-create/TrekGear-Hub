
const validateTent = (req, res, next) => {
    console.log("Validation middleware is running!");

    const { tent_name, brand, capacity, price, location } = req.body;
    const errors = [];

    if (typeof tent_name !== 'string' || !tent_name.trim()) {
        errors.push('Tent name is required');
    }

    if (typeof brand !== 'string' || !brand.trim()) {
        errors.push('Brand is required');
    }

    if (
        capacity === undefined ||
        capacity === null ||
        !Number.isInteger(Number(capacity)) ||
        Number(capacity) <= 0
    ) {
        errors.push('Capacity must be a positive integer');
    }

    if (
        price === undefined ||
        price === null ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        errors.push('Price must be a valid non-negative number');
    }

    if (typeof location !== 'string' || !location.trim()) {
        errors.push('Location is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

module.exports = { validateTent };
