const {Sequelize} = require("sequelize");
require('dotenv').config()
const database = process.env.db;
const userName = process.env.dbUserName;
const password = process.env.dbPassword;



const sequelize = new Sequelize(database,userName,password,{
    host:"localhost",
    port:3306,
    dialect:'mysql'
})



module.exports = sequelize