
const mysql = require('mysql');
require('dotenv').config();
const connection =  mysql.createConnection({
    host:"localhost",
    user:'root',
    password:process.env.DB_PASSWORD,
   // database:'auth'
})

async function connectMysql(){
    connection.connect(function(err){
        if(err){
            console.error("error connection: "+err.stack);
            return;
        }

        console.log("connection as Id "+connection.threadId)
    });
}


module.exports={connectMysql}