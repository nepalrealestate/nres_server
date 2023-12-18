const {Sequelize} = require("sequelize");
const logger = require("./utils/errorLogging/logger");
require('dotenv').config()


const database = process.env.DB_NAME;
const userName = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host =  process.env.DB_HOST;
const port = process.env.DB_PORT;
const logging = process.env.DB_LOGGING



const sequelize = new Sequelize(database,userName,password,{
    host:host,
    port:port,
    dialect:'mysql',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    //logging: (msg)=>logger.log('info',msg)
    logging:false
})



module.exports = sequelize