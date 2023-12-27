const express = require("express");
const router = express.Router();

const {
    authorization,
    checkRole,
} = require("../middleware/auth");

const {
    getShippingOrders,
    createShippingOrder,
    updateProductShippingOrder,
    deleteShippingOrder,
    getSingleShippingOrder,
} = require("../controllers/shippingOrderController");

router.get("/", getShippingOrders);
router.post("/", createShippingOrder);
router.put("/:id", updateProductShippingOrder);
router.delete(":id", deleteShippingOrder);

router.get("/:id", getSingleShippingOrder);

module.exports = router;