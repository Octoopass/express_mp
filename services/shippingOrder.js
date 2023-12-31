const connection = require("../databases/mysql");

var ShippingOrder = function (shippingOrder = {}) {
  this.shipStatus = shippingOrder.shipStatus;
  this.receiveDate = shippingOrder.receiveDate;
};

// order: final transactionPoint -> receiver
const shippingOrderService = {
  getShippingOrders: ({page = 1, limit = 10}, {transactionId = undefined, hubId = undefined}) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT O.*, endpointID, transactionName as endpointName, T.hubID, H.hubName FROM shippingOrder O
          left join transactionPoint T on T.transactionId = O.endpointID
          left join hub H on H.hubID = T.hubID 
          group by O.orderID
          ${transactionId ? `having endpointID=${transactionId}` : ""}
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
  getSingleShippingOrder: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT O.*, transactionName as endpointName FROM shippingOrder O
        left join transactionPoint T on T.transactionID = O.endpointID
        where O.orderID = 1
        group by O.orderID
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  getTotalShippingOrder: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(orderID) as total FROM shippingOrder`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]?.total);
        }
      );
    }),
  createShippingOrder: (newShippingOrder, callback) => {
    connection.query(
      `INSERT INTO shippingOrder set ?`,
      newShippingOrder,
      callback
    );
  },
  updateShippingOrder: (id, updateProductCategory, callback) => {
    connection.query(
      `UPDATE shippingOrder set ? WHERE orderID = ${id}`,
      updateProductCategory,
      callback
    );
  },
  deleteShippingOrder: (id, callback) => {
    connection.query(
      `DELETE FROM shippingOrder WHERE orderID = ${id}`,
      callback
    );
  },
  checkShippingOrderIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from shippingOrder
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
  shippingOrderService,
  ShippingOrder,
};
