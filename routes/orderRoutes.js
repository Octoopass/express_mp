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

router.get("/", getOrders); // http://localhost:8080/orders
router.post("/", createOrder); // http://localhost:8080/orders
router.put("/:id", updateOrder); // http://localhost:8080/orders/id
router.delete("/:id", deleteOrder); // http://localhost:8080/orders/id

router.get("/:id", getSingleOrder)

module.exports = router;