const { throws } = require("assert");
const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty} = require("../property/model.property");
const { error } = require("console");
const propertyTableName = 'Property'
const houseTableName = 'House';
const landTableName = 'Land';
const apartmentTableName = 'Apartment';

const landFeedbackTableName = 'LandFeedback';
const schemaName = 'nres_property';

// Create Land Table

async function createLandTable(){
    // create property table before apartment table
    await createPropertyTable();
  const sqlQuery = `CREATE TABLE  IF NOT EXISTS ${schemaName}.${landTableName} 
  (
    property_ID INT NOT NULL PRIMARY KEY UNIQUE,
      land_type VARCHAR(255),
      soil VARCHAR(255),
      road_access_ft FLOAT,
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

async function createLandFeedbackTable(){

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${landFeedbackTableName} (

        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        feedback TINYTEXT,
        FOREIGN KEY (property_ID) REFERENCES ${schemaName}.${landTableName}(property_ID) ON DELETE CASCADE
    )`;

    try {
        const [row,field] = await pool.query(sqlQuery);
        return row;
       
    } catch (error) {
        throw error;
      
    }

    

}



async function insertLandProperty(property,landProperty){

    // if table is not create then create table
    await createLandTable();

    // insert property object data in property
    await insertProperty(property);


    const {property_ID,land_type,soil,road_access_ft} = landProperty;

    const insertQuery = `INSERT INTO ${schemaName}.${landTableName} VALUES (?,?,?,?)`;

    try {
        const [result,field] = await pool.query(insertQuery,[property_ID,land_type,soil,road_access_ft])
        return result;
    } catch (error) {
       throw error;
    }


}



async function getLandProperty(condition,limit,offSet){


    let sqlQuery = `SELECT p.*,l.* FROM ${schemaName}.${propertyTableName} AS p INNER JOIN ${schemaName}.${landTableName} AS l ON p.property_ID=l.property_ID WHERE 1=1 `;

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



async function insertLandFeedback(property_ID,feedback){

    // if table is not create then create table
    await createLandFeedbackTable();

    const insertQuery = `INSERT INTO ${schemaName}.${landFeedbackTableName} VALUES (?,?)`;

    try {
        
        const[result,field] = await pool.query(insertQuery,[property_ID,feedback]);
        return result;
    } catch (error) {
       throw error;
    }


}


async function getLandByID(property_ID){

    const getQuery = `SELECT p.*,l.* FROM ${schemaName}.${propertyTableName} AS p INNER JOIN ${schemaName}.${landTableName} AS l ON p.property_ID=${property_ID}`;

    try {
        const [result,field] = await pool.query(getQuery);
        return result[0];//return object not array
    } catch (error) {
        throw error;
    }

}



 




module.exports = {insertLandProperty,getLandProperty,insertLandFeedback,getLandByID};