const express = require("express");
const router = express.Router();

const {
    authorization,
    checkRole,
} = require("../middleware/auth");

const {
    getShippingBranchs,
    createShippingBranch,
    updateShippingBranch,
    deleteShippingBranch,
} = require("../controllers/shippingBranchController");

router.get("/", getShippingBranchs);
router.post("/", createShippingBranch);
router.put("/:id", updateShippingBranch);
router.delete("/:id", deleteShippingBranch);

module.exports = router;