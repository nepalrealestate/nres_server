
const mysql = require('mysql2');
require('dotenv').config();

<<<<<<< HEAD
async function connectMysql(){
    connection.connect(function(err){
        if(err){
            console.error("error connection: "+err.stack);
            return;
        }
=======

>>>>>>> 2c9fd95767939e93baa69fa6ca105b81a221b5a1

const pool = mysql.createPool({
        host:"localhost",
        user:'root',
        password:process.env.DB_PASSWORD,
        database:'nres',
}).promise()//the promise() allow to use promises version



module.exports={pool}