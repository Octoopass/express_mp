const express = require("express");
const router = express.Router();

const {
    authorization,
    checkRole,
} = require("../middleware/auth");

const {
  getOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

router.get("/:id", getSingleOrder)

module.exports = router;