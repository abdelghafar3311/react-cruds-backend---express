// modules
const { Customer } = require("../../modules/Customer/Customer_Module");
const Owner = require("../../modules/Owners/Owner");
const Notification = require("../../modules/Notification/Notification");
const ProfileOwner = require("../../modules/Owners/OwnerProfile");


const mongoose = require("mongoose");

/**
 * @method POST
 * @param {string} req.body.user_id
 * @param {number} req.body.money
 * @returns {Object}
 * @throws {Error}
 * @access private
 * @description Transfers money from a customer to an owner or vice versa
 * @route /api/money/transfer
*/

const TranslateMoneyController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const money = Number(req.body.money);

        if (isNaN(money) || money <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Invalid money value" });
        }

        const userType = req.user.type.toLowerCase();

        if (req.user.id === req.body.user_id) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "You cannot transfer money to yourself" });
        }

        // ============================================================
        // 1️⃣  Customer → Owner
        // ============================================================
        if (userType === "customer") {
            const [customer, ownerProfile] = await Promise.all([
                Customer.findById(req.user.id).session(session),
                ProfileOwner.findOne({ Owner_Id: req.body.user_id }).session(session)
            ]);

            if (!customer) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Customer not found" });
            }

            if (!ownerProfile) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Owner profile not found" });
            }

            if (customer.money < money) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Insufficient balance" });
            }

            const ownerNewMoney = ownerProfile.money + money;
            const customerNewMoney = customer.money - money;

            await ProfileOwner.findByIdAndUpdate(
                ownerProfile._id,
                { $set: { money: ownerNewMoney } },
                { new: true, session }
            );

            await Customer.findByIdAndUpdate(
                req.user.id,
                { $set: { money: customerNewMoney } },
                { new: true, session }
            );

            const owner = await Owner.findById(req.body.user_id).session(session);
            const notification = new Notification({
                notifyType: "info",
                notifyMessage: `You have received $${money} from ${customer.username}`,
                User_Id: owner._id,
                User_Type: "Owner",
                notifyTitle: "Transfer Money"
            });
            await notification.save({ session });

            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: "Transfer money successfully" });
        }

        // ============================================================
        // 2️⃣  Owner → Customer
        // ============================================================
        const [ownerProfile, customer] = await Promise.all([
            ProfileOwner.findOne({ Owner_Id: req.user.id }).session(session),
            Customer.findById(req.body.user_id).session(session)
        ]);

        if (!ownerProfile) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Owner profile not found" });
        }

        if (!customer) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Customer not found" });
        }

        if (ownerProfile.money < money) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const ownerNewMoney = ownerProfile.money - money;
        const customerNewMoney = customer.money + money;

        await ProfileOwner.findByIdAndUpdate(
            ownerProfile._id,
            { $set: { money: ownerNewMoney } },
            { new: true, session }
        );

        await Customer.findByIdAndUpdate(
            req.body.user_id,
            { $set: { money: customerNewMoney } },
            { new: true, session }
        );

        const owner = await Owner.findById(req.user.id).session(session);
        const notification = new Notification({
            notifyType: "info",
            notifyMessage: `You have received $${money} from ${owner.username}`,
            User_Id: customer._id,
            User_Type: "Customer",
            notifyTitle: "Transfer Money"
        });
        await notification.save({ session });

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Transfer money successfully" });

    } catch (error) {
        console.error("Transfer error:", error);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    TranslateMoneyController
};