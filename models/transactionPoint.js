const connection = require("../databases/mysql");

var TransactionPoint = function (data = {}) {
  let { transactionName, transactionAddress, hubId } = data;
  if (transactionName) {
    this.transactionName = transactionName;
  }
  if (transactionAddress) {
    this.transactionAddress = transactionAddress;
  }
  if (hubId) {
    this.hubId = hubId;
  }
};

const transactionPointService = {
  getTransactionPoints: () =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM transactionpoint`, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    }),
  createTransactionPoint: (newTransactionPoint, callback) => {
    connection.query(
      `INSERT INTO transactionpoint set ?`,
      newTransactionPoint,
      callback
    );
  },
  updateTransactionPoint: (id, updateTransactionPoint, callback) => {
    connection.query(
      `UPDATE transactionpoint set ? WHERE transactionID = ${id}`,
      updateTransactionPoint,
      callback
    );
  },
  deleteTransactionPoint: (id, callback) => {
    connection.query(
      `DELETE FROM transactionpoint WHERE transactionID = ${id}`,
      callback
    );
  },
  checkTransactionIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from transactionpoint
      where transactionID = '${id}') as isExisted
    `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(Boolean(results[0]?.isExisted));
        }
      );
    }),
};

module.exports = {
  transactionPointService,
  TransactionPoint,
};
