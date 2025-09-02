const { Product } = require("../../modules/Product/Product");
const { Customer } = require("../../modules/Customer/Customer_Module");
const { Report } = require("../../modules/Report/Report");


/**
 * @method Delete
 * @description  delete products (Sell +money) and (here delete is +money because wrong add)
 * @route /api/sells/:id
 * @access private
 **/

const SellsProductIdController = async (req, res) => {
    try {
        /** @new @code **/
        // update customer
        const customer = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                sells: req.moneyAdd,
                money: req.custom_money
            }
        }, { new: true });
        // new report
        const report = new Report({
            report_for: "sells",
            money_push: req.moneyAdd,
            customer_id: req.customer.id,
            product_id: req.productId
        });
        await report.save();
        const { money, sells } = customer._doc
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Sell product successful", info: { money, sells }, Report: report });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
};

/**
 * @method Post
 * @description  sells by count
 * @route /api/sells/count
 * @access private
 **/

const SellsProductCountController = async (req, res) => {
    try {
        // update customer
        const customer = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                sells: req.moneyAdd,
                money: req.custom_money
            }
        }, { new: true });
        // new report
        const report = new Report({
            report_for: "sells",
            money_push: req.moneyAdd,
            customer_id: req.customer.id,
            product_id: req.productId
        });
        await report.save();
        const { money, sells } = customer._doc;

        if (req.product.count > req.count) {
            const calc = Math.abs(req.product.count - req.count);
            const update = await Product.findByIdAndUpdate(req.productId, {
                $set: {
                    count: calc,
                    isSold: true
                }
            }, { new: true });
            const { count } = update._doc;
            return res.status(200).json({ message: "Sell product successful", count, info: { money, sells }, report })
        }

        // here delete (sells)
        await Product.findByIdAndDelete(req.productId);
        return res.status(200).json({ message: "Sell product successful", info: { money, sells }, Report: report });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
}


module.exports = {
    SellsProductIdController,
    SellsProductCountController
};