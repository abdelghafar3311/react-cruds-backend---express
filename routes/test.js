const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.status(200).json({ message: "express is working .." })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

module.exports = router;