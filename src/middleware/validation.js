const { validationResult } = require('express-validator');

const validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    } else {
        return next();
    }
}

module.exports = {
    validation
}