const mysql2 = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbPool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "+07:00",
});

module.exports = dbPool;
