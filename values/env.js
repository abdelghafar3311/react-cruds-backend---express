const dotenv = require("dotenv").config();
// main system
const HOST = process.env.HOST;
const PORT = process.env.PORT;

// main database
const MongoDB_URL = process.env.MONGODB_URL;
// sys pass
const sysPass = process.env.SYS_PASS;
// SECRETE KEY FOR JWT
const secreteKey = process.env.SECRETE_KAY
const secreteKeyDelete = process.env.SECRETE_KAY_DELETED; // for delete account
const secreteKeyRental = process.env.SECRETE_KAY_RENTAL; // for reset password
const secreteKeySYS = process.env.SECRETE_KEY_SYS_00;
// Repo Github for upload image
const GITHUB_TOKEN_UPLOAD = process.env.GITHUB_TOKEN_UPLOAD;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME; // Replace with your GitHub username
const GITHUB_REPO = process.env.GITHUB_REPO; // Replace with your GitHub repository name
const GITHUB_BRANCH = process.env.GITHUB_BRANCH; // Replace with your desired branch name

// SITTING OF SYSTEM
const LIMIT_CUSTOMER = process.env.LIMIT_CUSTOMER;
const LIMIT_OWNER = process.env.LIMIT_OWNER;
const LIMIT_AREA = process.env.LIMIT_AREA;
const LIMIT_ROOMS = process.env.LIMIT_ROOMS;

module.exports = {
    HOST,
    PORT,
    MongoDB_URL,
    secreteKey,
    GITHUB_TOKEN_UPLOAD,
    GITHUB_USERNAME,
    GITHUB_REPO,
    GITHUB_BRANCH,
    LIMIT_OWNER,
    LIMIT_CUSTOMER,
    LIMIT_AREA,
    LIMIT_ROOMS,
    secreteKeyDelete,
    secreteKeyRental,
    secreteKeySYS,
    sysPass
}
