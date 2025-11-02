const express = require("express");
const router = express.Router();

// middlewares
const { verifyTokenSys } = require("../../middlewares/verifyToken");
// controllers
const { SysControllerAuth, SysControllerDetails, SysControllerRefactor } = require("../../controllers/SYS/sys.controllers");


router.post("/auth", SysControllerAuth);
router.get("/details", verifyTokenSys, SysControllerDetails);
router.delete("/refactor", verifyTokenSys, SysControllerRefactor);

module.exports = router;