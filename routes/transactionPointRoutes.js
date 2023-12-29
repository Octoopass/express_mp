const express = require("express");
const router = express.Router();

const { authorization, authorizePermissions } = require("../middleware/auth");

const {
  getTransactionPoints,
  createTransactionPoint,
  updateTransactionPoint,
  deleteTransactionPoint,
} = require("../controllers/transactionPointController");

router.get("/", getTransactionPoints);
router.post("/", createTransactionPoint);
router.put("/:id", updateTransactionPoint);
router.delete("/:id", deleteTransactionPoint);

module.exports = router;
