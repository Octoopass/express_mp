const connection = require("../databases/mysql");

var TransactionOrder = function (transactionOrder = {}) {
  this.tShipStatus = transactionOrder.shipStatus;
  this.tReceiveDate = transactionOrder.receiveDate;
};

// order: transactionPoint -> hub
const transactionOrderService = {
  getTransactionOrders: ({
    transactionId = undefined,
    hubId = undefined,
    page = 1,
    limit = 10,
  }) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT O.*, transactionName, T.hubID, H.hubName FROM transactionOrder O
        left join transactionPoint T on T.transactionId = O.transactionId
        left join hub H on H.hubID = T.hubID 
        group by O.orderID
        ${transactionId ? `having O.transactionId=${transactionId}` : ""}
        ${hubId ? `having T.hubID=${hubId}` : ""}
        ${page ? `limit ${(page - 1) * limit}, ${limit} ` : ""} 
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  getSingleTransactionOrder: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT * FROM transactionOrder O
          where orderID = '${id}'
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  getTotalTransactionOrder: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(orderID) as total FROM transactionOrder`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]?.total);
        }
      );
    }),
  createTransactionOrder: (newTransactionOrder, callback) => {
    connection.query(
      `INSERT INTO transactionOrder set ?`,
      newTransactionOrder,
      callback
    );
  },
  updateTransactionOrder: (id, updatetransactionOrder, callback) => {
    connection.query(
      `UPDATE transactionOrder set ? WHERE orderID = ${id}`,
      updatetransactionOrder,
      callback
    );
  },
  deleteTransactionOrder: (id, callback) => {
    connection.query(
      `DELETE FROM transactionOrder WHERE orderID = ${id}`,
      callback
    );
  },
  // check if there is a transactionOrder to corresponding hub for search's orderID
  checkTransactionOrderIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from transactionOrder
      where orderID = '${id}') as isExisted
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
  TransactionOrder,
  transactionOrderService,
};
