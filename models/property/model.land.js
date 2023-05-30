const { throws } = require("assert");
const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty, insertApplyProperty} = require("../property/model.property");
const { error } = require("console");
const { propertyTable, views } = require("../tableName");
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
  const sqlQuery = `CREATE TABLE  IF NOT EXISTS ${propertyTable.land}
  (
      property_id INT NOT NULL PRIMARY KEY UNIQUE,
      land_type VARCHAR(255),
      soil VARCHAR(255),
      road_access_ft FLOAT,
      FOREIGN KEY (property_ID) REFERENCES ${propertyTable.property}(property_ID) ON DELETE CASCADE
  
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



async function insertLandProperty(property,landProperty,user_id,user_type){

    // if table is not create then create table
    await createLandTable();

    // insert property object data in property
    await insertProperty(property,user_id,user_type);


    const {property_ID,land_type,soil,road_access_ft} = landProperty;

    const insertQuery = `INSERT INTO ${propertyTable.land} VALUES (?,?,?,?)`;

    try {
        const [result,field] = await pool.query(insertQuery,[property_ID,land_type,soil,road_access_ft])
        return result;
    } catch (error) {
       throw error;
    }


}



async function insertApplyLandProperty(property,landProperty,user_id,user_type){

    // create land table - shift to schema.sql

    try {
        await insertApplyProperty(property,user_id,user_type);
    } catch (error) {
        throw error;
    }

    const insertQuery = `INSERT INTO ${propertyTable.apply_land} VALUES (?,?,?,?,?)`;
    const insertValues = Object.values(landProperty);
    console.log(insertValues);

    try {
        const [result,field] = await pool.query(insertQuery,insertValues);
        return result;
    } catch (error) {
        
    }

    


}




async function getLandProperty(condition,limit,offSet){


    let sqlQuery = `SELECT property_id,property_name,listed_for,status,price,views,city,ward_number,tole_name FROM ${views.fullLandView} WHERE 1=1 `;
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


async function getApplyLandProperty(condition,limit,offSet){


    let sqlQuery = `SELECT * FROM ${views.applyLandView} WHERE 1=1 `;
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


async function getLandByID(property_id){

    const getQuery =   `SELECT * FROM ${views.fullLandView} WHERE property_id = ?`

    try {
        const [result,field] = await pool.query(getQuery,property_id);
        return result[0];//return object not array
    } catch (error) {
        throw error;
    }

}

async function getApplyLandByID(property_id){
    const getQuery =   `SELECT * FROM ${views.applyLandView} WHERE property_id = ?`

    try {
        const [result,field] = await pool.query(getQuery,property_id);
      
        return result[0];//return object not array
    } catch (error) {
        throw error;
    }
}



async function approveLand(staff_id,property_id){

    const updateQuery = `UPDATE ${propertyTable.apply_property} SET status='approved',approved_by_id=? WHERE property_id=?`;
    const shiftPropertyQuery = `INSERT INTO ${propertyTable.property} SELECT * FROM ${propertyTable.apply_property} WHERE property_id=?`;
    const shiftLandQuery = `INSERT INTO ${propertyTable.land} SELECT * FROM ${propertyTable.apply_land} WHERE property_id=?`;
    const deletePropertyQuery = ` DELETE FROM ${propertyTable.apply_property}  WHERE property_id = ? `;
    const deleteLandQuery = ` DELETE FROM ${propertyTable.apply_land} WHERE property_id = ? `;
   

    let connection ;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        console.log("Transaction Started");

        await connection.query(updateQuery,[staff_id,property_id]);
        
        await connection.query(shiftPropertyQuery,[property_id]);
        await connection.query(shiftLandQuery,[property_id]);
        await connection.query(deleteLandQuery,[property_id]);// first delete Land and then property
        await connection.query(deletePropertyQuery,[property_id]);
        

        await connection.commit();

        console.log('Transaction committed successfully');


    } catch (error) {
        console.log("error occur , rollback")
        await connection.rollback();
        console.log(error);
        throw error;
    }finally{
        if(connection){
            connection.release();
        }
    }
    
}


 




module.exports = {insertLandProperty,getLandProperty,insertLandFeedback,getLandByID,
    insertApplyLandProperty,getApplyLandProperty,approveLand,getApplyLandByID};