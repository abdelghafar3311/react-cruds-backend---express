const express = require("express");
const router = express.Router();
// middlewares
const { verifyTokenForProductDelete } = require("../../middlewares/verifyDelete")
// controllers
const {
    DeleteProductController
} = require("../../controllers/product/delete.controller");


router.delete("/:id", verifyTokenForProductDelete, DeleteProductController);

module.exports = router;