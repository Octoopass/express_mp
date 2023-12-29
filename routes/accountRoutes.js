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

router.post("/auth", login); // http://localhost:8080/accounts/auth
router.post("/logout", authorization, logout); // http://localhost:8080/accounts/logout
router.post("/", authorization, authorizePermissions('Dev', 'headAdmin'), createAccount); // http://localhost:8080/accounts 
router.get("/", authorization, authorizePermissions('Dev', 'headAdmin'), getAccounts); // http://localhost:8080/accounts?page=2&limit=10
router.get("/profile", authorization, getAccountDetail); // http://localhost:8080/accounts/profile
router.put("/:id", updateAccount); // http://localhost:8080/accounts/id
router.delete("/:id", deleteAccount); // http://localhost:8080/accounts/id

module.exports = router;