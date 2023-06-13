
const mysql = require("mysql2");
const fs = require("fs");


require("dotenv").config();

// read schema.sql file and excute all query to create db , schema and table

function excuteSQLFile() {
  

  fs.readFile("./schema.sql", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
   
    
    const modifiedData = data.replace(/nres_/g, `${process.env.DB_PREFIX}_nres_`);

    // after read file - split text 

    sqlQuery = modifiedData.split(";");
    //remove spaces and comments
    const validateQuery = sqlQuery.filter((query) => {
      const trimmedQuery = query.trim();

      return trimmedQuery !== "" && !trimmedQuery.startsWith("--");
    });

    validateQuery.forEach(async (query)=>{
        try {
                await pool.query(query);
                console.log("excute query ");

        } catch (error) {
               // console.log("error while excute",error.sqlMessage);
               console.log(query);
                
                
        }
    })
    

  });
}

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  })
  .promise(); //the promise() allow to use promises version

module.exports = { pool, excuteSQLFile };
