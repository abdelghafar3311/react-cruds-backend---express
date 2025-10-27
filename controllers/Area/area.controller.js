// import models
const Area = require("../../modules/Area/Area");
const Room = require("../../modules/Room/Room");
const { Customer } = require("../../modules/Customer/Customer_Module")
const Notification = require("../../modules/Notification/Notification");
// import create token
const { CreateDeleteToken } = require("../../middlewares/Token");
// service to create date
const addTimeToDate = require("../../services/addTimeToDate");

/** 
 * @method POST
 * @description  Create Area
 * @route /api/owner/area
 * @access private
 * @roles
 * # limit of Areas is 5
 * # limit of Rooms is 8
 */

const CreateAreaController = async (req, res) => {
    try {

        const areaData = req.areaData;
        const newArea = new Area(areaData);
        await newArea.save();
        // create rooms
        for (let i = 0; i < areaData.maxRooms; i++) {
            const newRoom = new Room({
                nameRoom: `Room ${i + 1}`,
                NumberRoom: i + 1,
                Area_Id: newArea._id,
                Owner_Id: areaData.Owner_Id
            });
            await newRoom.save();
        }
        const findRooms = await Room.find({ Area_Id: newArea._id });
        res.status(201).json({ message: "Area created successfully", area: newArea, rooms: findRooms });
    } catch (error) {
        console.error(error);
        if (error.code === 11000 && error.keyPattern?.nameArea) {
            return res.status(409).json({ message: "Area with this name already exists for this owner." });
        }
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method PUT
 * @description Update Area
 * @route /api/owner/area/:id
 * @access private
 **/
const UpdateAreaController = async (req, res) => {
    try {
        const areaId = req.params.id;
        const areaData = req.body;
        const area = await Area.findById(areaId);
        if (!area) {
            return res.status(404).json({ message: "Area not found" });
        }
        // check if the area belongs to the owner
        if (area.Owner_Id.toString() !== req.owner.id) {
            return res.status(403).json({ message: "You are not allowed to update this area." });
        }
        // update area
        const updatedArea = await Area.findByIdAndUpdate(areaId, areaData, { new: true });
        res.status(200).json({ message: "Area updated successfully", area: updatedArea });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * @method GET
 * @description get all Area
 * @route /api/owner/area
 * @access private
 **/

const GetAreasController = async (req, res) => {
    try {
        const query = req.query.q
        const areas = await Area.find({ Owner_Id: req.owner.id, nameArea: { $regex: query, $options: "i" } });
        if (areas.length === 0) {
            return res.status(404).json({ message: "No areas found for this owner." });
        }
        res.status(200).json(areas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * @method GET
 * @description get Area @id
 * @route /api/owner/area/one/:id
 * @access private
 **/

const GetByIdAreaController = async (req, res) => {
    try {
        const areaId = req.params.id;
        const area = await Area.findById(areaId).populate("Owner_Id", "username email");
        if (!area) {
            return res.status(404).json({ message: "Area not found" });
        }
        // check if the area belongs to the owner
        if (area.Owner_Id._id.toString() !== req.owner.id) {
            return res.status(403).json({ message: "You are not allowed to view this area." });
        }
        res.status(200).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * @method PATCH
 * @description update Area to ready for delete
 * @route /api/owner/area/delete/:id
 * @access private
 **/

const DeleteAreaController = async (req, res) => {
    try {
        const update = await Area.findByIdAndUpdate(req.params.id, {
            isDeleted: true,
        }, { new: true });

        if (!update) {
            return res.status(404).json({ message: "Area not found" });
        }

        const rooms = await Room.find({
            Area_Id: update._id,
            RentalType: { $in: ["rental", "expire"] }
        });
        for (const room of rooms) {
            const customer = await Customer.findById(room.Customer_Id);
            // make notification for customer
            const notification = new Notification({
                notifyType: "warn",
                notifyTitle: "Area will delete",
                notifyMessage: `The area where your store in room "${room.nameRoom}" has been rented will be deleted soon.`,
                User_Type: "Customer",
                User_Id: customer._id
            });
            await notification.save();
        }

        res.status(200).json({ message: "Area is ready for delete", area: update });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    CreateAreaController,
    UpdateAreaController,
    GetAreasController,
    GetByIdAreaController,
    DeleteAreaController
}