
const mysql = require('mysql2');
require('dotenv').config();
<<<<<<< HEAD



=======
>>>>>>> master
const pool = mysql.createPool({
        host:"localhost",
        user:'root',
        password:process.env.DB_PASSWORD,
        database:'nres',
}).promise()//the promise() allow to use promises version



module.exports={pool}