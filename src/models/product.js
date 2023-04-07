const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        slug: {
            type: String,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
        },
        category: {
            type: String,
        },
        brand: {
            type: String,
        },
        quantity: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
        color: [],
        tags: String,
        ratings: [
            {
                star: Number,
                comment: String,
                postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            },
        ],
        totalRating: {
            type: String,
            default: 0,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
