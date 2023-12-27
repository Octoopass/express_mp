const connection = require("../databases/mysql");

var TransactionOrder = function (order = {}) {
  this.orderID = order.orderId;
  this.type = order.type;
  this.weight = order.weight;
};

const transactionOrderService = {
  gettransactionOrders: ({ transactionId = undefined, hubId = undefined, page = 1, limit = 10 }) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT O.*, T.transactionName, H.hubID, H.hubName
          FROM orders O
          left join transactionpoint T on T.transactionID = O.transactionID
          left join hub H on H.hubID = T.hubID
          group by O.orderID  
          ${transactionId ? `having T.transactionID=${transactionId}` : ""}
          ${hubId ? `having H.hubID=${hubId}` : ""}
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
          SELECT * FROM orders O
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
  createTransactionOrder: (newtransactionOrder, callback) => {
    connection.query(`INSERT INTO orders set ?`, newtransactionOrder, callback);
  },
  updateTransactionOrder: (id, updatetransactionOrder, callback) => {
    connection.query(
      `UPDATE orders set ? WHERE orderID = ${id}`,
      updatetransactionOrder,
      callback
    );
  },
  deleteTransactionOrder: (id, callback) => {
    connection.query(`DELETE FROM orders WHERE orderID = ${id}`, callback);
  },
};

module.exports = {
  TransactionOrder,
  transactionOrderService,
};
