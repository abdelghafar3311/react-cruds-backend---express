const express = require("express");
const { Product } = require("../../modules/Product/Product");
const { Customer } = require("../../modules/Customer/Customer_Module");
const { Report } = require("../../modules/Report/Report");

const { verifyTokenForProductDelete } = require("../../middlewares/verifyDelete")
const router = express.Router();

/**
 * @method Delete
 * @description  delete products (Sell +money) and (here delete is +money because wrong add)
 * @route /api/delete_product/:id
 * @access private
 **/

router.delete("/:id", verifyTokenForProductDelete, async (req, res) => {
    try {
        // update customer
        const customer = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                sells: req.buys,
                money: req.custom_money
            }
        }, { new: true });
        const reportIds = Array.isArray(req.reportId) ? req.reportId : [req.reportId];
        await Report.deleteMany({ _id: { $in: reportIds } });
        const { sells, money } = customer._doc;
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Delete successful", info: { sells, money } });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
});

module.exports = router;