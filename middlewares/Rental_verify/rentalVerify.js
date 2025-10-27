const { verifyToken } = require("../verifyToken");
const { validPostRental, validPatchRental, validReqRentalAccept, validDeleteRental } = require("../../validations/rental.valid");
// modules
const Rented = require("../../modules/Rental/Rental");
const { Customer } = require("../../modules/Customer/Customer_Module");
const Room = require("../../modules/Room/Room");
const Area = require("../../modules/Area/Area");
const Owner = require("../../modules/Owners/Owner");
const OwnerProfile = require("../../modules/Owners/OwnerProfile");
const RentalRequest = require("../../modules/Rental/RentalRequest");
const mongoose = require("mongoose");
// post verify rental
const VerifyPostRental = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // variables
            let price_pay;
            // validate
            const { error, value } = validPostRental(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            req.body = value;
            // check customer
            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(403).json({ message: "You are not allowed to post a rental, please sign in first." })
            }
            // check room
            const room = await Room.findById(req.body.Room_Id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            if (room.isDeleted) {
                return res.status(403).json({ message: "Room will delete" });
            }
            if (room.RentalType === "rental" || room.RentalType === "expire") {
                return res.status(403).json({ message: "Room is not available for rental" });
            }
            price_pay = room.price * +req.body.timeNumber;
            if (room.Discount > 0) {
                price_pay = room.Discount * +req.body.timeNumber;
            }
            // check area
            const area = await Area.findById(room.Area_Id);
            if (!area) {
                return res.status(404).json({ message: "Area not found" });
            }
            if (area.isDeleted) {
                return res.status(403).json({ message: "Area will delete" });
            }
            // check owner
            const owner = await Owner.findById(req.body.Owner_Id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            // check owner has this room
            if (owner._id.toString() !== room.Owner_Id.toString()) {
                return res.status(403).json({ message: "You are not allowed to post a rental for this room" });
            }
            // get owner profile
            const ownerProfile = await OwnerProfile.findOne({ Owner_Id: owner._id });
            if (!ownerProfile) {
                return res.status(400).json({ message: "Error In Rental, Please Try Again" });
            }
            if (ownerProfile.isDeleted) {
                return res.status(403).json({ message: "Owner will delete" });
            }
            // check if room is already rented
            const rental = await Rented.findOne({ Room_Id: room._id });
            if (rental && rental.subscriptionState === "active") {
                return res.status(403).json({ message: "Sorry, you can't post a rental for this room" });
            }
            if (rental && rental.isAccept === "accept") {
                return res.status(403).json({ message: "Sorry, you can't post a rental for this room" });
            }
            if (rental && rental.isAccept === "reject") {
                return res.status(403).json({ message: "Sorry, you can't post a rental for this room" });
            }
            // check Rental Req is find
            const rentalReq = await RentalRequest.findOne({ Customer_Id: customer._id, Room_Id: room._id });
            if (rentalReq) {
                return res.status(403).json({ message: "You have a pending request to post a rental" });
            }
            // check customer money is enough
            if (customer.money < price_pay) {
                return res.status(403).json({ message: "You don't have enough money to post a rental" });
            }
            // add date
            const addDate = `${req.body.timeNumber}${req.body.timeType}`
            // attach values to request object
            req.customer = customer;
            req.area = area;
            req.room = room;
            req.ownerDB = owner;
            req.AddDate = addDate;
            req.money = price_pay;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

// verify get all rental request
const verifyGetAllRentalsRequest = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(403).json({ message: "You Not Authorized" });
            }

            // attach values to request object
            req.owner = owner;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

// accept / reject request rental
const VerifyReqRentalAccept = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // joi check
            const { error, value } = validReqRentalAccept(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            req.body = value;
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(403).json({ message: "You Not Authorized" });
            }
            // check id params is object id
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid rental ID." });
            }
            // check request
            const request = await RentalRequest.findById(req.params.id);
            if (!request) {
                return res.status(404).json({ message: "Request not found" });
            }
            // check owner has this request
            if (owner._id.toString() !== request.Owner_Id.toString()) {
                return res.status(403).json({ message: "You are not allowed to accept / reject this request" });
            }
            // get rental from request
            const rental = await Rented.findById(request.Rental_Id);
            if (!rental) {
                // delete request
                await RentalRequest.findByIdAndDelete(request._id);
                return res.status(404).json({ message: "Rental not found" });
            }
            if (rental.isAccept === "accept") {
                return res.status(403).json({ message: "You are not allowed to accept / reject this request" });
            }
            // attach values to request object
            req.ownerDB = owner;
            req.request = request;
            req.rental = rental;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    })
}

// verify patch rental
const VerifyPatchRental = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // variables
            let price_pay = 0;
            // validate
            const { error, value } = validPatchRental(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            // check customer
            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(403).json({ message: "You are not allowed to patch a rental, please sign in first." })
            }
            // check id params is object id
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid rental ID." });
            }
            // check rental
            const rental = await Rented.findById(req.params.id);
            if (!rental) {
                return res.status(404).json({ message: "Rental not found" });
            }
            // check rental isDeleted false
            if (rental.isDeleted) {
                return res.status(403).json({ message: "Rental will delete" });
            }
            // check customer has this rental
            if (customer._id.toString() !== rental.Customer_Id.toString()) {
                return res.status(403).json({ message: "You are not allowed to patch this rental" });
            }
            // check owner
            const owner = await Owner.findById(rental.Owner_Id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            // gey profile of owner
            const profile = await OwnerProfile.findOne({ Owner_Id: owner._id });
            if (!profile) {
                return res.status(500).json({ message: "Error Server Internal, Please Try Again in anther time" });
            }
            if (profile.isDeleted) {
                return res.status(403).json({ message: "Owner will delete" });
            }
            // check owner has this room
            if (owner._id.toString() !== rental.Owner_Id.toString()) {
                return res.status(403).json({ message: "You are not allowed to patch a rental for this room" });
            }
            // check rental is expired
            if (rental.subscriptionState === "active") {
                return res.status(403).json({ message: "Rental is not expired" });
            }
            // check room
            const room = await Room.findById(rental.Room_Id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            if (room.isDeleted) {
                return res.status(403).json({ message: "Room will delete" });
            }
            price_pay = room.price * +req.body.timeNumber;
            if (room.Discount > 0) {
                price_pay = room.Discount * +req.body.timeNumber;
            }
            const area = await Area.findById(room.Area_Id);
            if (!area) {
                return res.status(404).json({ message: "Area not found" });
            }
            if (area.isDeleted) {
                return res.status(403).json({ message: "Area will delete" });
            }
            if (customer.money < price_pay) {
                return res.status(403).json({ message: "You don't have enough money to patch a rental" });
            }

            const Money = price_pay;
            const addMoneyForOwner = Money + profile.money;
            const time = `${req.body.timeNumber}${req.body.timeType}`;
            const newMoney = customer.money - Money;
            // attach values to request object 
            req.body = value;
            req.customer = customer;
            req.owner = owner;
            req.rental = rental;
            req.room = room;
            req.money = newMoney;
            req.moneyRental = Money;
            req.area = area;
            req.addDate = time;
            req.addMoneyForOwner = addMoneyForOwner;
            req.profile = profile;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

// verify get rentals for owner and customer
const verifyGetAllRentals = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            // check user
            let rentals;
            let profile;

            if (req.user.type === "customer") { // customer
                // find customer
                profile = await Customer.findById(req.user.id);
                if (!profile) {
                    return res.status(403).json({
                        message: "You are not allowed to get rentals, please sign in first.",
                    });
                }

                const ReqRental = await RentalRequest.find({ Customer_Id: profile._id }).populate("Room_Id", "nameRoom NumberRoom").lean();

                // req pending
                const ReqPending = await RentalRequest.find({ Customer_Id: profile._id, status: "pending" }).lean();

                rentals = await Rented.find({ Customer_Id: profile._id })
                    .populate("Room_Id", "nameRoom NumberRoom price Discount")
                    .populate("Owner_Id", "username")
                    .populate("Area_Id", "nameArea address")
                    .populate("Customer_Id", "username money")
                    .lean();

                // find all rentals for this customer
                // get Requests for this customer
                const requests = await RentalRequest.find({ Rental_Id: { $in: rentals.map((rental) => rental._id) } });
                rentals = rentals.map((rental) => {
                    const request = requests.find((request) => request.Rental_Id.toString() === rental._id.toString());
                    return { ...rental, request };
                })
                rentals = { rentals, ReqRental };
            } else if (req.user.type === "owner") { // owner
                profile = await Owner.findById(req.user.id);
                if (!profile) {
                    return res.status(404).json({ message: "Owner not found" });
                }
                // find all rentals for this owner
                rentals = await Rented.find({ Owner_Id: profile._id })
                    .populate("Room_Id", "nameRoom NumberRoom")
                    .populate("Area_Id", "nameArea address")
                    .populate("Customer_Id", "username")
                    .lean();
            } else { // invalid user
                return res.status(403).json({ message: "Invalid user type" });
            }
            // check rentals
            // if (!rentals || rentals.length === 0) {
            //     req.rentals = [];
            //     req.profile = profile;
            //     return next();
            // }
            // attach rentals and profile to req
            req.rentals = rentals;
            req.profile = profile;
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

// verify delete rental with customer
const VerifyDeleteCustomerRental = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            //  check customer
            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(403).json({ message: "You are not allowed to delete a rental, please sign in first." })
            }
            // check rental from params
            const rental = await Rented.findById(req.params.id);
            if (!rental) {
                return res.status(404).json({ message: "Rental not found" });
            }

            // check customer has this room
            if (customer._id.toString() !== rental.Customer_Id.toString()) {
                return res.status(403).json({ message: "You are not allowed to delete a rental for this room" });
            }
            // check rental is accept or not
            if (rental.isAccept === "pending" || rental.isAccept === "reject") {
                return res.status(403).json({ message: "Rental is not accepted" });
            }
            // check rental is expired
            if (rental.subscriptionState === "active") {
                return res.status(403).json({ message: "Rental is not expired" });
            }
            // attach values to request object 
            req.customer = customer;
            req.rental = rental;
            req.room = await Room.findById(rental.Room_Id);
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

// verify delete from Owner
const VerifyDeleteOwnerRental = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { error, value } = validDeleteRental(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            req.body = value;
            // check owner
            const owner = await Owner.findById(req.owner.id);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            // check rental from params
            const rental = await Rented.findById(req.params.id);
            if (!rental) {
                return res.status(404).json({ message: "Rental not found" });
            }
            // check owner has this room
            if (owner._id.toString() !== rental.Owner_Id.toString()) {
                return res.status(403).json({ message: "You are not allowed to delete a rental for this room" });
            }
            // attach values to request object 
            req.owner = owner;
            req.rental = rental;
            req.customer = rental.Customer_Id !== null ? await Customer.findById(rental.Customer_Id) : null;
            req.room = await Room.findById(rental.Room_Id);
            next();
        } catch (error) {
            console.error("Middleware error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}


module.exports = {
    VerifyPostRental,
    verifyGetAllRentals,
    VerifyPatchRental,
    VerifyDeleteCustomerRental,
    VerifyDeleteOwnerRental,
    verifyGetAllRentalsRequest,
    VerifyReqRentalAccept
}