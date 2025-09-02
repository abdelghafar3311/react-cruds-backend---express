// modules data
const { Customer } = require("../../modules/Customer/Customer_Module");

/**
 * @method Put
 * @description  Add Money
 * @route /api/money/control/push
 * @access private
**/

const AddMoneyController = async (req, res) => {
    try {
        const customerUpdateMoney = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                money: req.newMoney
            }
        }, { new: true });

        if (!customerUpdateMoney) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const { money } = customerUpdateMoney._doc

        return res.status(200).json({ message: "success push", money });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method put
 * @description  update Money
 * @route /api/money/control/update
 * @access private
**/

const UpdateMoneyController = async (req, res) => {
    try {

        const updateCustomer = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                money: +req.body.money
            }
        }, { new: true });

        if (!updateCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const { money } = updateCustomer._doc;
        return res.status(200).json({ message: "success update", money });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    AddMoneyController,
    UpdateMoneyController
}