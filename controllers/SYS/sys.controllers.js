// create token sys
const { CreateTokenSYS } = require("../../middlewares/Token");
// valid sys
const { validSysPass } = require("../../validations/sys.valid");
// password
const { sysPass } = require("../../values/env");

// models
/// users && profiles
const { Customer } = require("../../modules/Customer/Customer_Module");
const CustomerProfile = require("../../modules/Customer/CustomerProfile");
const Owner = require("../../modules/Owners/Owner");
const OwnerProfile = require("../../modules/Owners/OwnerProfile");
/// authors
const { Product } = require("../../modules/Product/Product");
const { Report } = require("../../modules/Report/Report");
const Rentals = require("../../modules/Rental/Rental");
const ReqRentals = require("../../modules/Rental/RentalRequest");
const Rooms = require("../../modules/Room/Room");
const Areas = require("../../modules/Area/Area");
const notification = require("../../modules/Notification/Notification");

const mongoose = require("mongoose");

/**
 * @method Post
 * @description  Login sys
 * @route /api/sys00/auth
 * @access public
 **/

const SysControllerAuth = async (req, res) => {
    try {
        const { error } = validSysPass(req.body);
        if (error) {
            return res.status(400).json({ message: "syntax is wrong", error: error.details[0].message })
        }

        if (req.body.sysPass !== sysPass) {
            return res.status(400).json({ message: "The password is wrong" })
        }

        const token = CreateTokenSYS({ name: "tager.sys", dir: "tager/.sys/auth" });
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


/**
 * @method Get
 * @description  sys Get All Data as number
 * @route /api/sys00/details
 * @access private
 **/

const SysControllerDetails = async (req, res) => {
    try {
        const [
            customers,
            customerProfiles,
            owners,
            ownerProfiles,
            products,
            reports,
            rentals,
            reqRentals,
            rooms,
            areas,
            notifications
        ] = await Promise.all([
            Customer.countDocuments(),
            CustomerProfile.countDocuments(),
            Owner.countDocuments(),
            OwnerProfile.countDocuments(),
            Product.countDocuments(),
            Report.countDocuments(),
            Rentals.countDocuments(),
            ReqRentals.countDocuments(),
            Rooms.countDocuments(),
            Areas.countDocuments(),
            notification.countDocuments()
        ]);

        res.status(200).json({
            customers,
            customerProfiles,
            owners,
            ownerProfiles,
            products,
            reports,
            rentals,
            reqRentals,
            rooms,
            areas,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


/**
 * @method Delete
 * @description  sys refactor data
 * @route /api/sys00/refactor
 * @access private
 **/

const SysControllerRefactor = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await Customer.deleteMany({}, { session });
        await CustomerProfile.deleteMany({}, { session });
        await Owner.deleteMany({}, { session });
        await OwnerProfile.deleteMany({}, { session });
        await Product.deleteMany({}, { session });
        await Report.deleteMany({}, { session });
        await Rentals.deleteMany({}, { session });
        await ReqRentals.deleteMany({}, { session });
        await Rooms.deleteMany({}, { session });
        await Areas.deleteMany({}, { session });
        await notification.deleteMany({}, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Data refactored successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).json({ message: "Internal Server Error, rolled back all changes" });
    }
};


module.exports = {
    SysControllerAuth,
    SysControllerDetails,
    SysControllerRefactor
}