const express = require("express");
const router = express.Router();
// get verify token
const { VerifyPostRental,
    verifyGetAllRentals,
    VerifyPatchRental,
    VerifyDeleteCustomerRental,
    VerifyDeleteOwnerRental,
    verifyGetAllRentalsRequest,
    VerifyReqRentalAccept
} = require("../../middlewares/Rental_verify/rentalVerify");
// modules
const Rental = require("../../modules/Rental/Rental");
const { Customer } = require("../../modules/Customer/Customer_Module");
const RentalRequest = require("../../modules/Rental/RentalRequest");
const OwnerProfile = require("../../modules/Owners/OwnerProfile");
// services
const addTimeToDate = require("../../services/addTimeToDate");
// token
const { CreateTokenRental } = require("../../middlewares/Token");

// controllers
const {
    AddNewRentalController,
    GetAllRequestRentalController,
    ReqRentalAcceptController,
    GetAllRentalController,
    UpdateSubscriptionController,
    DeleteSubscriptionController,
    DeleteRentalController
} = require("../../controllers/Rental/rental.controller");


router.post("/sug-subscript", VerifyPostRental, AddNewRentalController);

router.get("/request", verifyGetAllRentalsRequest, GetAllRequestRentalController);

router.patch("/request/:id", VerifyReqRentalAccept, ReqRentalAcceptController);

router.get("/", verifyGetAllRentals, GetAllRentalController);

router.patch("/updateSubscription/:id", VerifyPatchRental, UpdateSubscriptionController);

router.delete("/delete_subscription/:id", VerifyDeleteCustomerRental, DeleteSubscriptionController);

router.patch("/owner/delete/:id", VerifyDeleteOwnerRental, DeleteRentalController);

module.exports = router;