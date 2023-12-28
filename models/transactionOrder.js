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
};

module.exports = {
  TransactionOrder,
  transactionOrderService,
};
