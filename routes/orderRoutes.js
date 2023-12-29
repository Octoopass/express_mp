const express = require("express");
const router = express.Router();

const { authorization, authorizePermissions } = require("../middleware/auth");

const {
  getOrders,
  getSingleOrder,
  getSuperSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder); 
router.delete("/:id", deleteOrder); 

router.get("/:id", getSingleOrder);
router.get("/super", getSuperSingleOrder);

module.exports = router;
