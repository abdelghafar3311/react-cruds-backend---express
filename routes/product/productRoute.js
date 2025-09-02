const express = require("express");
const router = express.Router();

const { verifyTokenForProductsGet, verifyTokenForProductSearch, verifyTokenForProductPut } = require("../../middlewares/verifyProducts")
// controllers
const {
    GetProductsController,
    UpdateProductController,
    SearchProductController
} = require("../../controllers/product/productRoute.controller");


router.get("/", verifyTokenForProductsGet, GetProductsController);

router.put("/:id", verifyTokenForProductPut, UpdateProductController);

router.post("/search", verifyTokenForProductSearch, SearchProductController);


module.exports = router;