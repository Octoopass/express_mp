const express = require("express");
const router = express.Router();

const {
    getTransactionOrders,
    getSingleTransactionOrder,
    createTransactionOrder,
    updateTransactionOrder,
    deleteTransactionOrder,
} = require("../controllers/transactionOrderController");

const {
    authorization,
    authorizePermissions,
} = require("../middleware/auth");

router.get("/", getTransactionOrders);
router.post("/", createTransactionOrder);
router.put("/:id", updateTransactionOrder);
router.delete(":id", deleteTransactionOrder);

router.get("/:id", getSingleTransactionOrder);

module.exports = router;

