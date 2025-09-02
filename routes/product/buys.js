const express = require("express");
const router = express.Router();

const { verifyTokenForProductBuy, verifyTokenForProductsBuy } = require("../../middlewares/verifyBuys")

// controllers
const {
    PostNewProductController,
    PostNewProductsController
} = require("../../controllers/product/buys.controller");

router.post("/product", verifyTokenForProductBuy, PostNewProductController);

router.post("/products", verifyTokenForProductsBuy, PostNewProductsController);

module.exports = router;