// githubUpload.js

// uploadConfig.js
const multer = require('multer');
const path = require('path');

const { GITHUB_TOKEN_UPLOAD, GITHUB_USERNAME, GITHUB_BRANCH, GITHUB_REPO } = require("../values/env")

const storage = multer.memoryStorage(); // Using memory storage for direct upload to GitHub

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});




async function uploadToGitHub(fileBuffer, fileName) {
    const { Octokit } = await import("@octokit/rest");

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN_UPLOAD
    });

    const owner = process.env.GITHUB_USERNAME;
    const repo = process.env.GITHUB_REPO;
    const path = `uploads/${Date.now()}-${fileName}`;

    const content = fileBuffer.toString("base64");

    const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Upload ${fileName}`,
        content
    });

    return `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
}




module.exports = {
    upload,
    uploadToGitHub
};


/*
// server.js

const upload = require("./uploadConfig");
const uploadToGitHub = require("./githubUpload");




app.post("/update-profile/:id", upload.single("image"), async (req, res) => {
    try {
        const imageUrl = await uploadToGitHub(req.file.buffer, req.file.originalname);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { profileImage: imageUrl },
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
*/