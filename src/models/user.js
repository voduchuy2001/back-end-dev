const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        role: {
            type: String,
            default: "user",
        },
        blocked: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        address: {
            type: String,
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpired: Date,
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('User', userSchema);