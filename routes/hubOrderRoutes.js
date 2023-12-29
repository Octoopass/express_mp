const express = require("express");
const router = express.Router();

const {
    getHubOrders,
    getSingleHubOrder,
    createHubOrder,
    updateHubOrder,
    deleteHubOrder,
} = require("../controllers/hubOrderController");

const {
    authorization,
    authorizePermissions,
} = require("../middleware/auth");

router.get("/", getHubOrders);
router.post("/", createHubOrder);
router.put("/:id", updateHubOrder);
router.delete(":id", deleteHubOrder);

router.get("/:id", getSingleHubOrder);

module.exports = router;

