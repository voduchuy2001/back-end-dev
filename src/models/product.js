const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: String,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        images: [{
            url: String,
            publicId: String,
        }],
        reviews: [
            {
                user: {
                    type: Object,
                },
                rating: {
                    type: Number,
                },
                comment: {
                    type: String,
                },
                productId: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now(),
                }
            },
        ],
        ratings: {
            type: Number,
        },
        soldOut: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
