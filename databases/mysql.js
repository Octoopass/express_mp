const mysql = require("mysql2");

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
} = require("../constants/config");

// local mysql db connection
var connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

// connect to database
connection.connect(function (err) {
  if (err) console.error(err);
});

module.exports = connection;
