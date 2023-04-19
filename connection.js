
const mysql = require('mysql2');
require('dotenv').config();
<<<<<<< HEAD
=======
// async function connectMysql(){
//     connection.connect(function(err){
//         if(err){
//             console.error("error connection: "+err.stack);
//             return;
//         }

>>>>>>> 204d302b4b01388bd3fe84594dfa34fb3dbf8a11
const pool = mysql.createPool({
        host:"localhost",
        user:'root',
        password:process.env.DB_PASSWORD,
        database:'nres',
}).promise()//the promise() allow to use promises version



module.exports={pool}