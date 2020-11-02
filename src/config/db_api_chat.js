const mysql2 = require('mysql2')

const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DATABASE
} = require('../helper/env')

const conection = mysql2.createConnection({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DATABASE,
  dateStrings: 'date'
})

module.exports = conection