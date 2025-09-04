// modules
const Rental = require("../../modules/Rental/Rental");
const { Customer } = require("../../modules/Customer/Customer_Module");
const RentalRequest = require("../../modules/Rental/RentalRequest");
const OwnerProfile = require("../../modules/Owners/OwnerProfile");
const Room = require("../../modules/Room/Room");
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
        const rental = new Rental({
            Room_Id: req.room._id,
            Owner_Id: req.owner._id,
            Area_Id: req.area._id,
            isAccept: "pending",
            Customer_Id: req.customer.id,
            Owner_Id: req.ownerDB._id
        });
        await rental.save();
        const requestRental = new RentalRequest({
            time: req.AddDate,
            pay: req.money,
            Customer_Id: req.customer.id,
            Owner_Id: req.ownerDB._id,
            Rental_Id: rental._id
        })

        await requestRental.save();
        res.status(201).json({ Rental: rental, RentalRequest: requestRental });
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
        const findRequests = await RentalRequest.find({ Owner_Id: req.owner.id }).populate("Rental_Id").lean();
        res.status(200).json(findRequests);
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
            await OwnerProfile.findByIdAndUpdate(req.ownerDB._id, { $set: { money: newMoneyOwner } }, { new: true });
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
                    subscriptionState: "active"
                }
            }, { new: true });
            // make room is rental
            await Room.findByIdAndUpdate(rental.Room_Id, { $set: { RentalType: "rental" } }, { new: true });
            // delete request
            await RentalRequest.findByIdAndDelete(req.params.id);
            // return result
            return res.status(200).json({ message: "Operation successful", Rental: newRental, yourMoney: newMoney });
        }

        // create token for req to delete
        const token = CreateTokenRental({ room: rental.Room_Id, customer: rental.Customer_Id, owner: req.ownerDB._id, area: rental.Area_Id }, "1d");
        // update isAccept to reject
        await RentalRequest.findByIdAndUpdate(req.params.id, { $set: { willDelete: true, DeleteToken: token } }, { new: true });
        // delete rental
        await Rental.findByIdAndUpdate(reqRental.Rental_Id, {
            $set: {
                isAccept: "reject",
                rejectToken: token
            }
        }, { new: true });
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

        res.status(200).json({ Rental: rental, Customer: customer });
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
                isDeleted: true
            }
        }, { new: true });
        return res.status(200).json({ message: "Delete successful", rental: update });
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