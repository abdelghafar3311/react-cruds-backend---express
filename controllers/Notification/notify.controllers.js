
// services
const addTimeToDate = require("../../services/addTimeToDate");
// token
const { CreateTokenNotifiesRead, CreateDeleteToken } = require("../../middlewares/Token");

const Notification = require("../../modules/Notification/Notification");


/**
 * @method Get
 * @description  Get All Notification
 * @route /api/notify/get
 * @access private
**/

const GetAllNotifyControllers = async (req, res) => {
    try {
        const notifies = req.notifies
        res.status(200).json(notifies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @method patch
 * @description  trans notification to read
 * @route /api/notify/read
 * @access private
**/

const ReadNotifiesControllers = async (req, res) => {
    try {

        // create token
        const token = CreateTokenNotifiesRead({ id: req.user.id }, "1d");
        // update notification
        await Notification.updateMany({ _id: { $in: req.ids }, User_Id: req.user.id }, { isRead: true, TokenIsRead: token });
        res.status(200).json({ message: "Update successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @method patch
 * @description  trans notification to Delete
 * @route /api/notify/delete
 * @access private
**/

const DeleteNotifiesControllers = async (req, res) => {
    try {
        // create token and date
        const token = CreateDeleteToken({ id: req.user.id }, "3d");
        const { result, error } = addTimeToDate(new Date(), "3d");
        if (error) {
            return res.status(400).json({ message: error });
        }
        // update notification
        await Notification.updateMany({ _id: { $in: req.ids }, User_Id: req.user.id }, { isDeleted: true, TokenIsDeleted: token, DateWillDelete: result });
        res.status(200).json({ message: "Update successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    GetAllNotifyControllers,
    ReadNotifiesControllers,
    DeleteNotifiesControllers
}