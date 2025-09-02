// modules
const { Report } = require("../../modules/Report/Report");
const { Customer } = require("../../modules/Customer/Customer_Module");

/**
 * @method GET
 * @description get all report
 * @route /api/report
 * @access private
 */

const GetAllReportsController = async (req, res) => {
    try {
        // check customer
        const customer = await Customer.findById(req.customer.id);
        if (!customer) return res.status(404).json({ message: "Error in customer, you not found" });

        const reports = await Report.find({ customer_id: customer._id });
        return res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method DELETE
 * @description delete all report
 * @route /api/report/delete
 * @access private
 */

const DeleteAllReportsController = async (req, res) => {
    try {
        // check customer
        const customer = await Customer.findById(req.customer.id);
        if (!customer) return res.status(404).json({ message: "Error in customer, you not found" });

        const reports = await Report.deleteMany({ customer_id: customer._id });
        return res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};


module.exports = {
    GetAllReportsController,
    DeleteAllReportsController
}