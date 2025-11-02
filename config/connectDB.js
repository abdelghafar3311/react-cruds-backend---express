const mongoose = require("mongoose");
const { MongoDB_URL } = require("../values/env");

if (!MongoDB_URL) {
    throw new Error("❌ MongoDB_URL not defined in environment variables");
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    console.log("⏳ wait connection DB...");

    if (cached.conn) {
        console.log("⚡ Using existing MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MongoDB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                bufferCommands: false,
                serverSelectionTimeoutMS: 30000,
            })
            .then((mongoose) => {
                console.log("✅ MongoDB Connected");
                return mongoose;
            })
            .catch((err) => {
                console.error("❌ MongoDB connection failed:", err);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;
