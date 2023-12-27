const connection = require("../databases/mysql");

var Order = function (order = {}) {
  this.orderID = order.orderId;
  this.senderName = order.senderName;
  this.receiverName = order.receiverName;
  this.senderAddress = order.senderAddress;
  this.receiverAddress = order.receiverAddress;
  this.receiverPhoneNumber = order.receiverPhoneNumber;
  this.type = order.type;
  this.weight = order.weight;
};

const orderService = {
  getOrders: ({ branchId = undefined, hubId = undefined }) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT *, T.transactionName FROM Orders O
          left join transactionpoint T on T.transactionID = O.transactionID
          left join Hub H on H.hubID = O.hubID
          group by O.orderID
          ${branchId ? `having O.branchId=${branchId}` : ""}
          ${hubId ? `having B.hubId=${hubId}` : ""} 
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  getSingleOrder: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT * FROM Order O
          where orderId = '${id}'
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  createOrder: (newOrder, callback) => {
    connection.query(
      `INSERT INTO Order set ?`,
      newOrder,
      callback
    );
  },
  updateOrder: (id, updateOrder, callback) => {
    connection.query(
      `UPDATE Order set ? WHERE orderId = ${id}`,
      updateOrder,
      callback
    );
  },
  deleteOrder: (id, callback) => {
    connection.query(
      `DELETE FROM Order WHERE orderId = ${id}`,
      callback
    )
  },
};

module.exports = {
  Order,
  orderService,
};
