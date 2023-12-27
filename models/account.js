const connection = require("../databases/mysql");

var Account = function (account = {}) {
  this.Email = account.email;
  this.Username = account.username;
  this.FullName = account.fullName;
  this.Position = account.position;
  if (account.transactionID) {
    this.transactionID = account.transactionID;
  }
  if (account.hubID) {
    this.hubID = account.hubID;
  }
  if (account.password) {
    this.password = account.password;
  }
};

const accountService = {
  auth: (data, callback) => {
    connection.query(
      "SELECT * FROM Account WHERE Username = ?",
      [data?.username, data?.password],
      callback
    );
  },
  getTotalAccount: (search = "") =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(AccountID) as total FROM Account        
        where concat(FullName, Email, Username) LIKE '%${search}%'
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]?.total);
        }
      );
    }),
  getAccounts: ({ page = 1, limit = 10, search = "" }, callback) => {
    connection.query(
      `
      select 
        AccountID, Email, Username, FullName, 
        A.transactionID as transactionID, T.transactionName as transactionName, 
        A.hubID as hubID, H.hubName as hubName,
        Position, CreateDate
      from Account as A  
      left join transactionpoint as T on T.transactionID = A.transactionID
      left join hub as H on H.hubID = A.hubID
      where concat(FullName, Email, Username) LIKE '%${search}%'
      ${page ? `limit ${(page - 1) * limit}, ${limit} ` : ""} 
      `,
      callback
    );
  },
  getAccountDetail: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        select 
          AccountID, Email, Username, FullName, 
          A.transactionID as transactionID, T.transactionName as transactionName, 
          A.hubID as hubID, H.hubName as hubName,
          Position, CreateDate
        from Account as A
        left join transactionpoint as T on T.transactionID = A.transactionID
        left join hub as H on H.hubID = A.hubID
        where A.AccountID = '${id}'
        `,
        (error, results) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          console.log(results);
          return resolve(results[0]);
        }
      );
    }),
  getAccountPosition: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT Position FROM Account
        WHERE accountID = '${id}'
        `,
        (error, results) => {
          if (error) return reject(error);
          return resolve(results)
        }
      );
    }),
  checkEmailExists: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT EXISTS(select * from Account
        where Email = '${email}') as isExisted
      `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(Boolean(results[0]?.isExisted));
        }
      );
    }),
  checkUsernameExists: (username) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT EXISTS(select * from Account
        where Username = '${username}') as isExisted
      `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(Boolean(results[0]?.isExisted));
        }
      );
    }),
  createAccount: (newAccount, callback) => {
    connection.query(`INSERT INTO Account set ?`, newAccount, callback);
  },
  updateAccount: (id, updateAccount, callback) => {
    connection.query(
      `UPDATE Account set ? WHERE AccountID = ${id}`,
      updateAccount,
      callback
    );
  },
  deleteAccount: (id, callback) => {
    connection.query(`DELETE FROM Account WHERE AccountID = ${id}`, callback);
  },
};

module.exports = {
  Account,
  accountService,
};
