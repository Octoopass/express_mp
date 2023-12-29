require("dotenv").config();
const bcrypt = require("bcryptjs");
const { SESSION_SECRET } = require("../constants/config");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
};

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw Error;
  }
  console.log("token", token);
  try {
    console.log("try");
    const data = jwt.verify(token, SESSION_SECRET);
    if (data.accountId) {
      req.userId = data.accountId;
    } else {
      throw Error;
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.status(403).send({ message: "Forbidden" });
  }
};

const positionIdToRole = {
  1: "Dev",
  2: "headAdmin",
  3: "hubAdmin",
  4: "transactionAdmin",
  5: "hubEmployee",
  6: "transactionEmployee",
};

const authorizePermissions =
  (...roles) =>
  (req, res, next) => {
    const token = req.cookies.token;
    const data = jwt.verify(token, SESSION_SECRET);
    const role = positionIdToRole[data.positionId[0].PositionID];
    if (!roles.includes(role)) {
      return res.status(401).send("Unauthorized");
    }
    next();
  };

module.exports = {
  hashPassword,
  authorization,
  authorizePermissions,
};
