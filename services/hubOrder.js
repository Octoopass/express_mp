const connection = require("../databases/mysql");

var HubOrder = function (hubOrder = {}) {
  this.hShipStatus = hubOrder.shipStatus;
  this.hReceiveDate = hubOrder.receiveDate;
};

// order: hub -> endpointTransaction (currently)
const hubOrderService = {
  getHubOrders: ({page = 1, limit = 10}, {transactionId = undefined, hubId = undefined}) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT hO.*, T.hubID, H.hubName, endpointID, E.transactionName as endpointName FROM hubOrder hO
        left join orders O on O.orderID = hO.orderID
        left join transactionPoint T on T.transactionId = O.transactionId
        left join hub H on H.hubID = T.hubID 
        left join transactionPoint E on E.transactionId = endpointID
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
  getSingleHubOrder: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT * FROM hubOrder O
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
  getTotalHubOrder: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(orderID) as total FROM hubOrder`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]?.total);
        }
      );
    }),
  createHubOrder: (newHubOrder, callback) => {
    connection.query(
      `INSERT INTO hubOrder set ?`,
      newHubOrder,
      callback
    );
  },
  updateHubOrder: (id, updatehubOrder, callback) => {
    connection.query(
      `UPDATE hubOrder set ? WHERE orderID = ${id}`,
      updatehubOrder,
      callback
    );
  },
  deleteHubOrder: (id, callback) => {
    connection.query(
      `DELETE FROM hubOrder WHERE orderID = ${id}`,
      callback
    );
  },
  // check if there is a hubOrder to corresponding hub for search's orderID
  checkHubOrderIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from hubOrder
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
  HubOrder,
  hubOrderService,
};
