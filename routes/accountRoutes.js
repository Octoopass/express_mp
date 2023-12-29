const express = require("express");
const router = express.Router();

const { authorization, authorizePermissions } = require("../middleware/auth");

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
router.post(
  "/",
  authorization,
  authorizePermissions("Dev", "headAdmin"),
  createAccount
);
router.get(
  "/",
  authorization,
  authorizePermissions("Dev", "headAdmin"),
  getAccounts
);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);
router.get("/profile", authorization, getAccountDetail);

module.exports = router;
