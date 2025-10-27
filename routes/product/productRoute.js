const express = require("express");
const router = express.Router();

const { verifyTokenForProductsGet, verifyTokenForProductGetById, verifyTokenForProductSearch, verifyTokenForProductPut } = require("../../middlewares/verifyProducts")
// controllers
const {
    GetProductsController,
    UpdateProductController,
    SearchProductController,
    GetProductsByIdController
} = require("../../controllers/product/productRoute.controller");


router.get("/", verifyTokenForProductsGet, GetProductsController);

router.put("/:id", verifyTokenForProductPut, UpdateProductController);

router.get("/:id", verifyTokenForProductGetById, GetProductsByIdController);

router.post("/search", verifyTokenForProductSearch, SearchProductController);


module.exports = router;