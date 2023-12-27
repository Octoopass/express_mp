const express = require("express");
const router = express.Router();

const {
    authorization,
    checkRole,
} = require("../middleware/auth");

const {
    getAccounts,
    getAccountDetail,
    login,
    logout,
    createAccount,
    updateAccount,
    deleteAccount,
} = require("../controllers/accountController");

router.post("/auth", login);
router.post("/logout", authorization, logout);
router.post("/", [authorization, checkRole(["admin"])], createAccount);
router.get("/", getAccounts);
router.get("/profile", authorization, getAccountDetail);
router.put("/:id", updateAccount);
router.delete("/:id", [authorization, checkRole(["admin"])], deleteAccount);

module.exports = router;