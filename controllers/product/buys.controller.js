const express = require("express");
const router = express.Router();
// modules
const { Product } = require("../../modules/Product/Product")
const { Customer } = require("../../modules/Customer/Customer_Module")
const Rental = require("../../modules/Rental/Rental");
const { Report } = require("../../modules/Report/Report")


/**
 * @method Post
 * @description  post new product one (buy -money) check money
 * @route /api/buys/product
 * @access private
 **/

const PostNewProductController = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                money: req.money,
                buys: req.pay
            }
        }, { new: true });
        const product = new Product({
            nameProduct: req.body.nameProduct,
            category: req.body.category,
            count: req.body.count,
            price: req.body.price,
            taxes: req.body.taxes,
            ads: req.body.ads,
            discount: req.body.discount,
            gain: req.body.gain,
            customer_id: req.customer.id,
            Rental_Id: req.rental._id,
        });

        const result = await product.save();

        const report = new Report({
            report_for: "buys",
            money_push: req.pay,
            customer_id: req.customer.id,
            product_id: result._id
        })

        await report.save();
        res.status(201).json({ message: "success add product", Report: report });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.nameProduct) {
            return res.status(409).json({ message: "Product name already exists. Please choose a different name." });
        }
        res.status(500).json({ message: "Internal Server Error", error })
    }
};

/**
 * @method Post
 * @description  post new products (buy -money) check money
 * @route /api/buys/products
 * @access private
 **/

const PostNewProductsController = async (req, res) => {
    try {
        let data = req.body;
        for (const item of data) {
            item.customer_id = req.customer.id;
        }

        await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                money: req.money,
                buys: req.pay
            }
        }, { new: true });

        const product = await Product.insertMany(data);

        const reports = product.map(i => {
            const pay_product = (i.price + i.ads + i.taxes) * i.count;
            return new Report({
                report_for: "buys",
                money_push: pay_product,
                customer_id: req.customer.id,
                product_id: i._id
            }).save();
        });
        const Reports = await Promise.all(reports);
        return res.status(201).json({ message: "success save products", Reports })
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.nameProduct) {
            return res.status(409).json({ message: "Product name already exists. Please choose a different name." });
        }
        res.status(500).json({ message: "Internal Server Error", error: error?.errorResponse?.message || error.message })
    }
};

module.exports = {
    PostNewProductController,
    PostNewProductsController
};