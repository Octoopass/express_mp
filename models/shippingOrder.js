const connection = require("../databases/mysql");

var ShippingOrder = function (shippingOrder = {}) {
  let { shippingOrderName } = shippingOrder;
  if (shippingOrderName) {
    this.CategoryName = shippingOrderName;
  }
};

// order: final transactionPoint -> receiver
const shippingOrderService = {
  getShippingOrders: ({ transactionId = undefined, hubId = undefined, page = 1, limit = 10 }) =>
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
  getSingleShippingOrder: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT O.*, transactionName FROM shippingOrder O
          left join transactionPoint T on T.transactionID = O.transactionID
          where sOrderID = '${id}'
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
  createShippingOrder: (newShippingOrder, callback) => {
    connection.query(
      `INSERT INTO shippingOrder set ?`,
      newShippingOrder,
      callback
    );
  },
  updateShippingOrder: (id, updateProductCategory, callback) => {
    connection.query(
      `UPDATE shippingOrder set ? WHERE sOrderID = ${id}`,
      updateProductCategory,
      callback
    );
  },
  deleteShippingOrder: (id, callback) => {
    connection.query(`DELETE FROM shippingOrder WHERE sOrderID = ${id}`, callback);
  },
  checkOrderIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from shippingOrder
      where sOrderID = '${id}') as isExisted
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
