const { Product } = require("../../modules/Product/Product");
const { Customer } = require("../../modules/Customer/Customer_Module");
const { Report } = require("../../modules/Report/Report");



/**
 * @method Delete
 * @description  delete products (Sell +money) and (here delete is +money because wrong add)
 * @route /api/delete_product/:id
 * @access private
 **/

const DeleteProductController = async (req, res) => {
    try {
        // update customer
        const customer = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                sells: req.buys,
                money: req.custom_money
            }
        }, { new: true });
        // new report
        const report = new Report({
            report_for: "sells",
            money_push: req.buys,
            customer_id: req.customer.id,
            product_id: req.params.id
        });
        await report.save();
        const { sells, money } = customer._doc;
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Delete successful", info: { sells, money } });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
};

module.exports = {
    DeleteProductController
};