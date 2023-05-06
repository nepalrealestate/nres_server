const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty} = require("../property/models.property");
const propertyTableName = 'Property'
const houseTableName = 'House';
const houseFeedbackTableName = 'HouseFeedback';
const schemaName = 'nres_property';

// Create House Table

async function createHouseTable(){
    //if not exists then create property table
    await createPropertyTable();
    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${houseTableName} 
    (
        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        room INT,
        floor FLOAT,
        furnish_status BOOL,
        parking BOOL,
        road_access_ft FLOAT,
        facilities VARCHAR(1000),
        FOREIGN KEY (property_ID) REFERENCES ${schemaName}.${propertyTableName}(property_ID) ON DELETE CASCADE
    
    )`;

    try {
        const[row,field] = await pool.query(sqlQuery);
        console.log("Table Created");
        return row;
    } catch (error) {
       throw error;
    }

}

async function createHouseFeedbackTable(){

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${houseFeedbackTableName} (

        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        feedback TINYTEXT,
        FOREIGN KEY (property_ID) REFERENCES ${schemaName}.${houseTableName}(property_ID) ON DELETE CASCADE
    )`;

    try {
        const [row,field] = await pool.query(sqlQuery);
        return row;
       
    } catch (error) {
        throw error;
      
    }

    

}



async function insertHouseProperty(property,houseProperty){

   

   await createHouseTable();

   //two different object recieve for store data 
   await insertProperty(property);

   

   const { property_ID,room,floor,furnish_status,parking,road_access_ft,facilities } = houseProperty;

   const insertQuery = `INSERT INTO ${schemaName}.${houseTableName} VALUES (?,?,?,?,?,?,?)`;

   try {
       const [result,field] = await pool.query(insertQuery,[property_ID,room,floor,furnish_status,parking,road_access_ft,facilities])
       return result;
   } catch (error) {

      
       throw error;
       
   }


}


async function getHouseProperty(condition,limit,offSet){


    let sqlQuery = `SELECT p.*,h.* FROM ${schemaName}.${propertyTableName} AS p INNER JOIN ${schemaName}.${houseTableName} AS h ON p.property_ID=h.property_ID WHERE 1=1 `;

    const params = [];
    //adding search conditon on query
    for(let key of Object.keys(condition)){

       

        if(condition[key]){
            // adding search conditon and  push value in params array;
            sqlQuery += `AND ${key} = ?`
            params.push(condition[key]);
        }

    }

    //after adding search condition query

    sqlQuery += `LIMIT ${limit} OFFSET ${offSet}`

    
    

    try {
        const [result,field] = await pool.query(sqlQuery,params);
      
        return result;
    } catch (error) {
        throw error;
    }



}


async function insertHouseFeedback(property_ID,feedback){

    //if table is not create then create table
    await createHouseFeedbackTable();

    const insertQuery = `INSERT INTO ${schemaName}.${houseFeedbackTableName} VALUES (?,?)`;

    try {
        
        const[result,field] = await pool.query(insertQuery,[property_ID,feedback]);
        return result;
    } catch (error) {
        throw error;
    }


}

async function getHouseByID(property_ID){

    const getQuery = `SELECT p.*,h.* FROM ${schemaName}.${propertyTableName} AS p INNER JOIN ${schemaName}.${houseTableName} AS h ON p.property_ID=${property_ID} `;

    try {
        const [result,field] = await pool.query(getQuery);
        return result[0];// return object not array
        } catch (error) {
        throw error;
    }

}



module.exports = {insertHouseProperty,getHouseProperty,insertHouseFeedback,getHouseByID}


