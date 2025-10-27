const express = require("express");
const router = express.Router();
// verifies
const { TransMoneyVerify } = require("../../middlewares/TransMoneyVerify/transMoneyVerify");
// controllers
const { TranslateMoneyController } = require("../../controllers/TransMoney/transMoney.controller");


router.post("/", TransMoneyVerify, TranslateMoneyController);

module.exports = router;