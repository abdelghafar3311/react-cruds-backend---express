const express = require("express");
const { Product } = require("../../modules/Product/Product")
const { Customer } = require("../../modules/Customer/Customer_Module")
const { Report } = require("../../modules/Report/Report")
const { verifyTokenForProductsGet, verifyTokenForProductSearch, verifyTokenForProductPut } = require("../../middlewares/verifyProducts")
const router = express.Router();

/**
 * @method Get 
 * @description  get products 
 * @route /api/product
 * @access private
 **/

router.get("/", verifyTokenForProductsGet, async (req, res) => {
    try {
        const products = await Product.find({ customer_id: req.customer.id }).select('-customer_id');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

/**
 * @method Put 
 * @description  update products (update buy && money) check money
 * @route /api/product/:id
 * @access private
 **/

router.put("/:id", verifyTokenForProductPut, async (req, res) => {
    try {
        const productUpdate = {
            nameProduct: req.body.nameProduct,
            category: req.body.category,
            count: req.body.count,
            price: req.body.price,
            gain: req.body.gain,
            taxes: req.body.taxes,
            ads: req.body.ads,
            discount: req.body.discount
        };
        if (req.updateMoneySystem) {
            await Customer.findByIdAndUpdate(req.customer.id, {
                $set: {
                    money: (req.moneyCustomer - req.newMoneyOfNewProduct),
                    buys: (req.buysCustomer + req.newMoneyOfNewProduct)
                }
            }, { new: true })

            await Product.findByIdAndUpdate(req.params.id, {
                $set: productUpdate
            }, { new: true });

        }
        await Product.findByIdAndUpdate(req.params.id, {
            $set: productUpdate
        }, { new: true });

        return res.status(200).json({ message: "updated successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
})


/**
 * @method Post
 * @description  search products 
 * @route /api/product/search
 * @access private
 **/

router.post("/search", verifyTokenForProductSearch, async (req, res) => {
    try {
        console.log("fun route")
        const { word, type } = req.body;
        const filter = { customer_id: req.customer.id };

        if (type === "category") {
            filter.category = { $regex: word, $options: "i" };
        } else {
            filter.nameProduct = { $regex: word, $options: "i" };
        }

        const results = await Product.find(filter);

        if (results.length === 0) {
            return res.status(404).json({ message: "No products found matching your search." });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ message: "Internal Server Error", error })
    }
})


module.exports = router;