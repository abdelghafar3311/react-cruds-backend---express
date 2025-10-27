// models
const Room = require("../../modules/Room/Room");
const Area = require("../../modules/Area/Area");
const Notification = require("../../modules/Notification/Notification");
const Rental = require("../../modules/Rental/Rental");
const { Customer } = require("../../modules/Customer/Customer_Module");
/**
 * @method PUT
 * @description Update room details
 * @route /room/update/:id
 * @access Private
 * */

const UpdateRoomController = async (req, res) => {
    try {
        const updateData = {
            nameRoom: req.body.nameRoom,
            NumberRoom: req.body.NumberRoom,
            price: req.body.price,
            description: req.body.description,
            status: req.body.status,
            length: req.body.length,
            width: req.body.width,
            Discount: req.body.Discount,
            Duration: req.body.Duration,
            isDeleted: req.body.isDeleted
        };
        // update room
        const updatedRoom = await Room.findByIdAndUpdate(req.room._id, updateData, { new: true });
        // update max rooms in area
        await Area.findByIdAndUpdate(req.area._id, {
            $inc: { maxRooms: 1 }
        }, { new: true });
        // return updated room
        res.status(200).json({
            message: "Store updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method POST
 * @description Create a new room
 * @route /api/room/create
 * @access Private
 * */

const CreateRoomController = async (req, res) => {
    try {
        // add 1 room in area
        await Area.findByIdAndUpdate(req.area._id, {
            $inc: { maxRooms: 1 }
        }, { new: true });
        // create new room
        const newRoom = new Room({
            nameRoom: req.body.nameRoom,
            NumberRoom: req.body.NumberRoom,
            price: req.body.price,
            description: req.body.description,
            status: req.body.status,
            length: req.body.length,
            width: req.body.width,
            Area_Id: req.area._id,
            Owner_Id: req.owner_id,
            Discount: req.body.Discount,
            Duration: req.body.Duration
        });

        // save room
        const savedRoom = await newRoom.save();

        // return created room
        res.status(201).json({
            message: "Store created successfully",
            room: savedRoom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

/**
 * @method GET
 * @description Get all rooms for owner
 * @route /room/owner/rooms
 * @access Private
 * */

const GetOwnersRoomsController = async (req, res) => {
    try {
        const rooms = await Room.find({ Owner_Id: req.owner.id }).populate("Area_Id", "nameArea maxRooms status address");
        return res.status(200).json({
            message: "Stores fetched successfully",
            rooms: rooms // assuming rooms are populated in owner model
        }); a
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method GET
 * @description Get one rooms for owner
 * @route /room/owner/rooms/:id
 * @access Private
 * */

const GetOneRoomController = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate("Area_Id", "nameArea maxRooms status address");
        return res.status(200).json({
            message: "Stores fetched successfully",
            room: room // assuming rooms are populated in owner model
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method GET
 * @description Get all available rooms for customers
 * @route /room/customer/rooms
 * @access Private
 * */

const GetCustomersRoomsController = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Available Stores fetched successfully",
            rooms: req.rooms // assuming rooms are populated in customer model
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method PATCH
 * @description update Room to ready for delete
 * @route /api/room/delete/:id
 * @access private
 **/

const DeleteRoomController = async (req, res) => {
    try {
        const update = await Room.findByIdAndUpdate(req.params.id, {
            isDeleted: true
        }, { new: true });

        if (!update) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (update.RentalType === "rental" || update.RentalType === "expire") {
            const getRental = await Rental.findOne({ Room_Id: update._id });
            const customer = await Customer.findById(getRental.Customer_Id);

            // make notification for customer
            const notification = new Notification({
                notifyType: "warn",
                notifyTitle: "Room Subscription",
                notifyMessage: "Store: " + update.nameRoom + " has been deleted when your rental will be expire",
                User_Type: "Customer",
                User_Id: customer._id
            });
            await notification.save();
        }

        res.status(200).json({ message: "Room is ready for delete", area: update });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    UpdateRoomController,
    CreateRoomController,
    GetOwnersRoomsController,
    GetCustomersRoomsController,
    DeleteRoomController,
    GetOneRoomController
}