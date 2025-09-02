const express = require("express");
// router
const router = express.Router();
// verifies
const { verifyTokenPushMoney, verifyTokenUpdateMoney } = require("../../middlewares/verifyMoney")

// controllers
const {
    AddMoneyController,
    UpdateMoneyController
} = require("../../controllers/money/money.controller")


router.put("/push", verifyTokenPushMoney, AddMoneyController)

router.put("/update", verifyTokenUpdateMoney, UpdateMoneyController)


module.exports = router;