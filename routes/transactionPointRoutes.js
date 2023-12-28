const express = require("express");
const router = express.Router();

const {
    authorization,
    checkRole,
} = require("../middleware/auth");

const {
    getTransactionPoints,
    createTransactionPoint,
    updateTransactionPoint,
    deleteTransactionPoint,
} = require("../controllers/transactionPointController");

router.get("/", getTransactionPoints); // http://localhost:8080/transactionPoint
router.post("/", createTransactionPoint); // http://localhost:8080/transactionPoint
router.put("/:id", updateTransactionPoint); // http://localhost:8080/transactionPoint/id
router.delete("/:id", deleteTransactionPoint); // http://localhost:8080/transactionPoint/id

module.exports = router;