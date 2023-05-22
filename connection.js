
const mysql = require('mysql2');
require('dotenv').config();



const pool = mysql.createPool({
        host:"localhost",
        user:'root',
        password:process.env.DB_PASSWORD,
        database:'nres',
        multipleStatements: true,
}).promise()//the promise() allow to use promises version



module.exports={pool}