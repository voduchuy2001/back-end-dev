const { default: mongoose } = require("mongoose");

const database = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connection succeeded.');
    } catch (error) {
        console.log('Error in DB connection: ', error);
    }
};
module.exports = database;
