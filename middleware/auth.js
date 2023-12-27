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
  console.log("token", token);
  if (!token) return res.sendStatus(403);
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    console.log("verifying");
    if (err) return res.sendStatus(403); //invalid token

    console.log(decoded); //for correct token
    next();
  });
};

// const authorization = (req, res, next) => {
//   const token = req.cookies.token;
//   console.log("token", token);
//   if (!token) {
//     throw Error("403");
//   }
//   try {
//     console.log("try");
//     const data = jwt.verify(token, SESSION_SECRET);
//     if (data.accountId) {
//       req.userId = data.accountId;
//     } else {
//       throw Error;
//     }
//     return next();
//   } catch (err) {
//     console.log(err);
//     return res.status(403).send({ message: "Forbidden" });
//   }
// };

const checkRole = (roles) => async (req, res, next) => {
  let { user_id } = req.body;

  //retrieve user info from DB
  const Users = await Users.findOne({ user_id });
  !roles.includes(Users.role)
      ? res.status(401).json("Sorry you do not have access to this route")
      : next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json("Unauthorized")
    }
    next();
  };
};


module.exports = {
  hashPassword,
  authorization,
  checkRole,
  authorizePermissions,
};
