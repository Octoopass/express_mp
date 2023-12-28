const connection = require("../databases/mysql");

var TransactionOrder = function (transactionOrder = {}) {
  this.shipStatus = transactionOrder.shipStatus;
  this.receiveDate = transactionOrder.receiveDate;
};

// order: transactionPoint -> hub
const transactionOrderService = {
  gettransactionOrders: ({ transactionId = undefined, hubId = undefined, page = 1, limit = 10 }) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT O.*, transactionName, T.hubID, H.hubName FROM shippingOrder O
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
          where tOrderID = '${id}'
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  createTransactionOrder: (newtransactionOrder, callback) => {
    connection.query(`INSERT INTO transactionOrder set ?`, newtransactionOrder, callback);
  },
  updateTransactionOrder: (id, updatetransactionOrder, callback) => {
    connection.query(
      `UPDATE transactionOrder set ? WHERE tOrderID = ${id}`,
      updatetransactionOrder,
      callback
    );
  },
  deleteTransactionOrder: (id, callback) => {
    connection.query(`DELETE FROM transactionOrder WHERE tOrderID = ${id}`, callback);
  },
};

module.exports = {
  TransactionOrder,
  transactionOrderService,
};
