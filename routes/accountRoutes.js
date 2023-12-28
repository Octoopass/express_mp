const express = require("express");
const router = express.Router();

const {
    authorization,
    authorizePermissions,
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
router.post("/logout",  logout);
router.post("/", createAccount);
router.get("/", getAccounts);
router.get("/profile", getAccountDetail);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;