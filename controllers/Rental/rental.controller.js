// modules
const Rental = require("../../modules/Rental/Rental");
const { Customer } = require("../../modules/Customer/Customer_Module");
const RentalRequest = require("../../modules/Rental/RentalRequest");
const OwnerProfile = require("../../modules/Owners/OwnerProfile");
const Room = require("../../modules/Room/Room");
const Notification = require("../../modules/Notification/Notification");
// services
const addTimeToDate = require("../../services/addTimeToDate");
// token
const { CreateTokenRental } = require("../../middlewares/Token");

/**
 * @method POST
 * @description add new rental
 * @route /api/rental/sug-subscript
 * @access private
*/

const AddNewRentalController = async (req, res) => {
    try {
        // get rental
        const RentalCheck = await Rental.findOne({ Room_Id: req.room._id });
        if (RentalCheck) {
            const requestRental = new RentalRequest({
                time: req.AddDate,
                pay: req.money,
                Owner_Id: req.ownerDB._id,
                Rental_Id: RentalCheck._id,
                Room_Id: req.room._id,
                Customer_Id: req.customer.id
            });

            await requestRental.save();
            return res.status(201).json({ message: "Rental Request added successfully" });
        }
        const rental = new Rental({
            Room_Id: req.room._id,
            Owner_Id: req.owner._id,
            Area_Id: req.area._id,
            isAccept: "pending",
            Owner_Id: req.ownerDB._id
        });
        await rental.save();
        const requestRental = new RentalRequest({
            time: req.AddDate,
            pay: req.money,
            Customer_Id: req.customer.id,
            Owner_Id: req.ownerDB._id,
            Rental_Id: rental._id,
            Room_Id: req.room._id
        })

        await requestRental.save();
        res.status(201).json({ message: "Rental Request added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

/**
 * @method GET
 * @description get all request rentals
 * @route /api/rental/request
 * @access private
*/

const GetAllRequestRentalController = async (req, res) => {
    try {
        const findRequestsRaw = await RentalRequest.find({ Owner_Id: req.owner.id }).populate("Customer_Id", "username").populate("Rental_Id", "isAccept").lean();

        const findRequests = Array.isArray(findRequestsRaw)
            ? findRequestsRaw
            : [findRequestsRaw];

        let RoomsRentalReq = await Room.find({
            _id: { $in: findRequests.map((r) => r.Room_Id?._id || r.Room_Id) },
        }).lean();

        RoomsRentalReq = RoomsRentalReq.map((room) => {
            const requests = findRequests.filter(
                (r) =>
                    (r.Room_Id?._id?.toString() || r.Room_Id?.toString()) ===
                    room._id.toString()
            );
            return { ...room, requests };
        });
        res.status(200).json(RoomsRentalReq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

/**
 * @method PATCH / DELETE
 * @description update request rental and access or not access
 *  if access => delete request and update is accept to true and add info time and pay
 *  if not access => delete rental and put token in request to delete for two hours
 * @route /api/rental/id
 * @access private
*/

const ReqRentalAcceptController = async (req, res) => {
    try {
        const isAccept = req.body.isAccept;
        const reqRental = await RentalRequest.findById(req.params.id);
        const rental = await Rental.findById(reqRental.Rental_Id);
        const room = await Room.findById(rental.Room_Id);
        console.log("rental: ", rental);
        const customer = await Customer.findById(reqRental.Customer_Id);
        if (isAccept === "accept") {
            // add new money to customer
            // check money
            if (customer.money < reqRental.pay) {
                return res.status(400).json({ message: "The Customer does not have enough money, you can reject the request" });
            }
            // add new money to customer
            const newMoney = customer.money - reqRental.pay;
            await Customer.findByIdAndUpdate(reqRental.Customer_Id, { $set: { money: newMoney } }, { new: true });
            // add money for owner
            const GetProfile = await OwnerProfile.findOne({ Owner_Id: req.ownerDB._id });
            console.log("test: ", req.ownerDB);
            const newMoneyOwner = GetProfile.money + reqRental.pay;
            await OwnerProfile.findByIdAndUpdate(GetProfile._id, { $set: { money: newMoneyOwner } }, { new: true });
            // update rental and add info time and pay
            const { result, error } = addTimeToDate(new Date(), reqRental.time);
            if (error) {
                return res.status(400).json({ message: error });
            }
            const token = CreateTokenRental({ room: rental.Room_Id, customer: rental.Customer_Id, owner: req.ownerDB._id, area: rental.Area_Id }, reqRental.time);

            const newRental = await Rental.findByIdAndUpdate(reqRental.Rental_Id, {
                $set: {
                    isAccept: "accept",
                    expires: token,
                    endDate: result,
                    pay: reqRental.pay,
                    subscriptionState: "active",
                    Customer_Id: reqRental.Customer_Id
                }
            }, { new: true });
            // make room is rental
            await Room.findByIdAndUpdate(rental.Room_Id, { $set: { RentalType: "rental" } }, { new: true });
            // delete request
            await RentalRequest.findByIdAndDelete(req.params.id);
            // make notification for customer
            const notification = new Notification({
                notifyType: "suc",
                notifyTitle: "Rental Request",
                notifyMessage: "Your request for Rental Store: " + room.nameRoom + " has been accepted",
                User_Type: "Customer",
                User_Id: reqRental.Customer_Id
            });
            await notification.save();
            // return result
            return res.status(200).json({ message: "Operation successful", Rental: newRental, yourMoney: newMoney });
        }

        // create token for req to delete
        const token = CreateTokenRental({ room: rental.Room_Id, customer: rental.Customer_Id, owner: req.ownerDB._id, area: rental.Area_Id }, "1d");

        // update isAccept to reject
        await RentalRequest.findByIdAndUpdate(req.params.id, { $set: { willDelete: true, DeleteToken: token, status: "reject" } }, { new: true });
        // make notification for customer
        const notification = new Notification({
            notifyType: "err",
            notifyTitle: "Rental Request",
            notifyMessage: "Your request for Rental Store: " + room.nameRoom + " has been rejected",
            User_Type: "Customer",
            User_Id: reqRental.Customer_Id
        });
        await notification.save();
        // response
        return res.status(200).json({ message: "Operation successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @method GET
 * @description get all rentals
 * @route /api/rental
 * @access private
*/
const GetAllRentalController = async (req, res) => {
    try {
        res.status(200).json(req.rentals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

/**
 * @method PATCH
 * @description patch a rental
 * @route /api/rental/updateSubscription/:id
 * @access private
*/

const UpdateSubscriptionController = async (req, res) => {
    try {
        // add new money to customer
        const customer = await Customer.findByIdAndUpdate(req.customer.id, {
            $set: {
                money: req.money
            }
        }, { new: true });
        const { result, error } = addTimeToDate(new Date(), req.addDate ?? "2d");
        if (error) {
            return res.status(400).json({ message: error });
        }
        const token = CreateTokenRental({ room: req.room._id, customer: req.customer.id, owner: req.owner._id, area: req.area._id }, req.addDate);
        const rental = await Rental.findByIdAndUpdate(req.params.id, {
            $set: {
                expires: token,
                endDate: result,
                subscriptionState: "active",
                pay: req.moneyRental
            }
        }, { new: true });
        // update room to rental
        await Room.findByIdAndUpdate(req.room._id, { $set: { RentalType: "rental" } }, { new: true });
        // add money
        await OwnerProfile.findByIdAndUpdate(req.profile._id, {
            money: req.addMoneyForOwner
        }, { new: true });
        // make notification for owner to know
        const notification = new Notification({
            notifyType: "info",
            notifyTitle: "Rental Subscription",
            notifyMessage: "Store: " + req.room.nameRoom + " has been updated subscription with customer name: " + customer.username,
            User_Type: "Owner",
            User_Id: req.owner._id
        });
        await notification.save();
        res.status(200).json({ message: "Operation successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

/**
 * @method DELETE By Customer
 * @description delete a rental
 * @route /api/rental/delete_subscription/:id
 * @access private
*/

const DeleteSubscriptionController = async (req, res) => {
    try {
        await Rental.findByIdAndDelete(req.params.id);
        // make notification for owner to know
        const notification = new Notification({
            notifyType: "info",
            notifyTitle: "Rental Subscription",
            notifyMessage: "Store: " + req.room.nameRoom + " has been deleted subscription with customer name: " + req.customer.username,
            User_Type: "Owner",
            User_Id: req.rental.Owner_Id
        })
        return res.status(200).json({ message: "Delete successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

/**
 * @method Patch By Owner
 * @description make isDeleted of rental true
 * @route /api/rental/owner/delete/:id
 * @access private
*///

const DeleteRentalController = async (req, res) => {
    try {
        const update = await Rental.findByIdAndUpdate(req.params.id, {
            $set: {
                isDeleted: req.body.isDeleted
            }
        }, { new: true });
        if (req.customer !== null) {
            // make notification for customer
            const notification = new Notification({
                notifyType: "warn",
                notifyTitle: "Rental Subscription",
                notifyMessage: "Store: " + req.room.nameRoom + " has been deleted subscription",
                User_Type: "Customer",
                User_Id: req.customer._id
            })
            await notification.save();
        }
        return res.status(200).json({ message: "Delete successful, when customer be expire rental will delete" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

module.exports = {
    AddNewRentalController,
    GetAllRequestRentalController,
    ReqRentalAcceptController,
    GetAllRentalController,
    UpdateSubscriptionController,
    DeleteSubscriptionController,
    DeleteRentalController
};