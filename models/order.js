const connection = require("../databases/mysql");

var Order = function (order = {}) {
  this.senderName = order.senderName;
  this.senderAddress = order.senderAddress;
  this.senderPhoneNumber = order.senderPhoneNumber;
  this.receiverName = order.receiverName;
  this.receiverAddress = order.receiverAddress;
  this.receiverPhoneNumber = order.receiverPhoneNumber;
  this.packageType = order.packageType;
  this.packageWeight = order.packageWeight;
  this.shippingFee = order.shippingFee;
  this.shipStatus = order.shipStatus;
};

const orderService = {
  getOrders: ({ transactionId = undefined, hubId = undefined, page = 1, limit = 10 }) =>
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
  getSingleOrder: (id) =>
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
  createOrder: (newOrder, callback) => {
    connection.query(`INSERT INTO orders set ?`, newOrder, callback);
  },
  updateOrder: (id, updateOrder, callback) => {
    connection.query(
      `UPDATE orders set ? WHERE orderID = ${id}`,
      updateOrder,
      callback
    );
  },
  deleteOrder: (id, callback) => {
    connection.query(`DELETE FROM orders WHERE orderID = ${id}`, callback);
  },
};

module.exports = {
  Order,
  orderService,
};
