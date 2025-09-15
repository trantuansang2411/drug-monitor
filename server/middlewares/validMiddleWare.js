// middlewares/validMiddleWare.js

// Middleware to validate name length
const validateName = (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Name is required'
        });
    }

    if (name.length <= 5) {
        return res.status(400).json({
            success: false,
            message: 'Name must be more than 5 characters long'
        });
    }

    next();
};

// Middleware to validate dosage format: XX-morning,XX-afternoon,XX-night
const validateDosage = (req, res, next) => {
    const { dosage } = req.body;

    if (!dosage) {
        return res.status(400).json({
            success: false,
            message: 'Dosage is required'
        });
    }

    // Regex pattern: XX-morning,XX-afternoon,XX-night (XX = 2 digits)
    const dosagePattern = /^\d{2}-morning,\d{2}-afternoon,\d{2}-night$/;

    if (!dosagePattern.test(dosage)) {
        return res.status(400).json({
            success: false,
            message: 'Dosage must follow format: XX-morning,XX-afternoon,XX-night (where XX are digits)'
        });
    }

    next();
};

// Middleware to validate card is more than 1000
const validateCard = (req, res, next) => {
    const { card } = req.body;

    if (card === undefined || card === null) {
        return res.status(400).json({
            success: false,
            message: 'Card is required'
        });
    }

    const cardNumber = parseInt(card);

    if (isNaN(cardNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Card must be a valid number'
        });
    }

    if (cardNumber <= 1000) {
        return res.status(400).json({
            success: false,
            message: 'Card must be more than 1000'
        });
    }

    next();
};

// Middleware to validate pack is more than 0
const validatePack = (req, res, next) => {
    const { pack } = req.body;

    if (pack === undefined || pack === null) {
        return res.status(400).json({
            success: false,
            message: 'Pack is required'
        });
    }

    const packNumber = parseInt(pack);

    if (isNaN(packNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Pack must be a valid number'
        });
    }

    if (packNumber <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Pack must be more than 0'
        });
    }

    next();
};

// Middleware to validate perDay is more than 0 and less than 90
const validatePerDay = (req, res, next) => {
    const { perDay } = req.body;

    if (perDay === undefined || perDay === null) {
        return res.status(400).json({
            success: false,
            message: 'PerDay is required'
        });
    }

    const perDayNumber = parseInt(perDay);

    if (isNaN(perDayNumber)) {
        return res.status(400).json({
            success: false,
            message: 'PerDay must be a valid number'
        });
    }

    if (perDayNumber <= 0 || perDayNumber >= 90) {
        return res.status(400).json({
            success: false,
            message: 'PerDay must be more than 0 and less than 90'
        });
    }

    next();
};

// Export all validation functions
module.exports = {
    validateName,
    validateDosage,
    validateCard,
    validatePack,
    validatePerDay
};