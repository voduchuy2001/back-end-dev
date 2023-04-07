const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        mobile: {
            type: String,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            default: "user",
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        cart: {
            type: Array,
            default: [],
        },
        address: {
            type: String,
        },
        refreshToken: {
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