const connection = require("../databases/mysql");

var Hub = function (data = {}) {
  let { hubName, hubAddress } = data;
  if (hubName) {
    this.hubName = hubName;
  }
  if (hubAddress) {
    this.hubAddress = hubAddress;
  }
};

const hubService = {
  getHubs: () =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM hub`, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    }),
  createHub: (newHub, callback) => {
    connection.query(`INSERT INTO hub set ?`, newHub, callback);
  },
  updateHub: (id, updateHub, callback) => {
    connection.query(
      `UPDATE hub set ? WHERE hubID = ${id}`,
      updateHub,
      callback
    );
  },
  deleteHub: (id, callback) => {
    connection.query(`DELETE FROM hub WHERE hubID = ${id}`, callback);
  },
  checkHubIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT EXISTS(select * from hub
          where hubId = '${id}') as isExisted
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
  hubService,
  Hub,
};
