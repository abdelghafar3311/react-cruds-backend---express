const dotenv = require("dotenv").config();
// main system
const HOST = process.env.HOST;
const PORT = process.env.PORT;

// main database
const MongoDB_URL = process.env.MONGODB_URL;

// SECRETE KEY FOR JWT
const secreteKey = process.env.SECRETE_KAY

module.exports = {
    HOST,
    PORT,
    MongoDB_URL,
    secreteKey
}