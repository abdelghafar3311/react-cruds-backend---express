const mongoose = require("mongoose");
const { MongoDB_URL } = require("../values/env")
const connectDB = async () => {
    console.log("wait connection DB ....")
    try {
        await mongoose.connect(MongoDB_URL);
        return console.log("success connect for mongoDB")

    } catch (error) {
        console.log("some error in connection DB, the error is =>> ", error)
    }
}

module.exports = connectDB;