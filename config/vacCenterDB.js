const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "alones12345#",
  database: "vacCenter",
});

module.exports = connection;
