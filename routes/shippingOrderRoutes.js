const express = require("express");
const router = express.Router();

const { authorization, authorizePermissions } = require("../middleware/auth");

const {
  getShippingOrders,
  createShippingOrder,
  updateShippingOrder,
  deleteShippingOrder,
  getSingleShippingOrder,
} = require("../controllers/shippingOrderController");

router.get("/", getShippingOrders);
router.post("/", createShippingOrder);
router.put("/:id", updateShippingOrder);
router.delete(":id", deleteShippingOrder);

router.get("/:id", getSingleShippingOrder);

module.exports = router;
