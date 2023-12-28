require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { accountService, Account } = require("../models/account");
const { hashPassword } = require("../middleware/auth");
const { SESSION_SECRET } = require("../constants/config");

const login = async (req, res, next) => {
  let { username, password } = req.body;
  if (username && password) {
    accountService.auth({ username }, async (error, results, fields) => {
      if (error) {
        next(err);
      }
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              { username, accountId: user["AccountID"] },
              SESSION_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.cookie("token", token);
            accountService
              .getAccountDetail(user?.AccountID)
              .then((result) => {
                if (err) {
                  console.error(err);
                } else {
                  res.send({ msg: "Success!" });
                }
              })
              .catch((err) => {
                throw Error;
              });
          } else {
            res
              .status(400)
              .send({ msg: "Incorrect Username or Password!" });
          }
        });
      } else {
        res.status(400).send({ msg: "Account not found" });
      }
    });
  } else {
    res.status(400).send({ msg: "Please enter Username and Password!" });
  }
};

const getAccounts = async (req, res, next) => {
  let { page, limit, search } = req.query;
  let { hubID, transactionID } = req.body;

  try {
    accountService.getAccounts({ page, limit, search }, { hubID, transactionID }, async (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({
          data: result,
          metadata: {
            total: await accountService.getTotalAccount(search),
            page,
            limit,
          },
        });
      }
    });
  } catch (error) {
    throw new Error("error!");
  }
};

const getAccountDetail = async (req, res) => {
  try {
    accountService
      .getAccountDetail(req?.userId)
      .then((result) => {
        res.send({ data: result });
      })
      .catch((err) => {
        console.log(err);
        throw Error;
      });
  } catch (error) {
    res.status(403).send({ message: "Forbidden!" });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("token"); // Clear session cookie if used
      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    res.status(403).send({ message: "Forbidden!" });
  }
};

const createAccount = async (req, res, next) => {
  const { email, fullName, username, positionId, password, transactionId, hubId } = req.body;
  //handles null error
  if (!(email && fullName && username && password)) {
    res.status(400).send({
      error: true,
      message: "Email, username, fullname, password are required",
    });
    return;
  }
  try {
    const newPassword = await hashPassword(password);
    var newAccount = new Account({ 
      ...req.body, 
      transactionID: transactionId, 
      hubID: hubId,
      password: newPassword 
    });
    

    const isEmailExisted = await accountService.checkEmailExists(email);
    const isUsernameExisted = await accountService.checkUsernameExists(
      username
    );
    if (isEmailExisted || isUsernameExisted) {
      res.status(400).send({
        error: true,
        message: `${isEmailExisted ? "Email" : "Username"} is existed`,
      });
      return;
    }
    accountService.createAccount(newAccount, (err, result) => {
      if (err) {
        next(err);
      } else {
        accountService
          .getAccountDetail(result?.insertId)
          .then((result) => {
            res.send({ data: result });
          })
          .catch((err) => {
            throw Error;
          });
      }
    });
  } catch (error) {
    res.status(400).send({ msg: error });
  }
};

const updateAccount = async (req, res, next) => {
  const accountId = req.params.id;
  const isExisted = await accountService.checkAccountExists(accountId);
  
  if (!isExisted) {
    res.status(404).send({ message: "Account not found" });
    return;
  }
  const { password } = req.body;
  let newPassword;
  if (password) {
    newPassword = await hashPassword(password);
  }
  const updateAccount = new Account({
    ...req.body,
    ...(password ? { password: newPassword } : {}),
  });
  accountService.updateAccount(accountId, updateAccount, (err, result) => {
    if (err) {
      next(err);
    } else {
      accountService
        .getAccountDetail(accountId)
        .then((result) => {
          res.send({ data: result });
        })
        .catch((err) => {
          throw Error;
        });
    }
  });
};

const deleteAccount = async (req, res, next) => {
  const isExisted = await accountService.checkAccountExists(req.params.id);
  
  if (!isExisted) {
    res.status(404).send({ message: "Account not found" });
    return;
  }
  accountService.deleteAccount(req.params.id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send({ msg: "Delete Success!" });
    }
  });
};

module.exports = {
  getAccounts,
  getAccountDetail,
  login,
  logout,
  createAccount,
  updateAccount,
  deleteAccount,
};
