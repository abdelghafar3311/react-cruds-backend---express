const express = require("express");
const { verifyTokenForProductSells, verifyTokenForSellsCount } = require("../../middlewares/verifySells")
const router = express.Router();

// controllers
const {
    SellsProductIdController,
    SellsProductCountController
} = require("../../controllers/product/sells.controller");

router.delete("/:id", verifyTokenForProductSells, SellsProductIdController);

router.post("/count", verifyTokenForSellsCount, SellsProductCountController);


module.exports = router;