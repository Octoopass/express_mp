const express = require("express");
const router = express.Router();

const { authorization, authorizePermissions } = require("../middleware/auth");

const {
  getHubOrders,
  getSingleHubOrder,
  createHubOrder,
  updateHubOrder,
  deleteHubOrder,
} = require("../controllers/hubOrderController");

router.get("/", getHubOrders);
router.post("/", createHubOrder);
router.put("/:id", updateHubOrder);
router.delete(":id", deleteHubOrder);

router.get("/:id", getSingleHubOrder);

module.exports = router;
