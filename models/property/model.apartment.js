const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty} = require("../property/model.property");
const propertyTableName = 'Property'
const houseTableName = 'House';
const landTableName = 'Land';
const apartmentTableName = 'Apartment';
const apartmentFeedbackTableName = 'ApartmentFeedback';
const schemaName = 'nres_property';


// Create Apartment Table

async function createApartmentTable (){

    // create property table before apartment table
    await createPropertyTable();

    const sqlQuery = `CREATE TABLE  IF NOT EXISTS ${schemaName}.${apartmentTableName} 
    (
        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        bhk INT,
        situated_floor INT,
        furnish_status BOOL,
        parking BOOL,
        facilities VARCHAR(1000),
        FOREIGN KEY (property_ID) REFERENCES ${schemaName}.${propertyTableName}(property_ID) ON DELETE CASCADE
    
    )`;

    try {
        const[row,field] = await pool.query(sqlQuery);
        console.log("Table Created");
        console.log(row);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function createApartmentFeedbackTable(){

    const sqlQuery = `CREATE TABLE IF NOT EXISTS  ${schemaName}.${apartmentFeedbackTableName} (

        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        feedback TINYTEXT,
        FOREIGN KEY (property_ID) REFERENCES  ${schemaName}.${apartmentTableName} (property_ID) ON DELETE CASCADE
    )`;

    try {
        const [row,field] = await pool.query(sqlQuery);
        //console.log(row);
        
    } catch (error) {
        console.log(error);
        throw error;
    }

    

}


async function insertApartmentProperty(property,apartmentProperty){

    // if table is not create then create table
    await createApartmentTable();

    // insert property object data in property
    try {
        await insertProperty(property);
    } catch (error) {
        
        throw error;
    }
   
   
   

    const {property_ID,bhk,situated_floor,furnish_status,parking,facilities} = apartmentProperty;

    const insertQuery = `INSERT INTO  ${schemaName}.${apartmentTableName}  VALUES (?,?,?,?,?,?)`;

    try {
        
        const [result,field] = await pool.query(insertQuery,[property_ID,bhk,situated_floor,furnish_status,parking,facilities]);
       
        return result;

    } catch (error) {
        
      
        throw error;

    }


}



async function getApartmentProperty(condition,limit,offSet){


    let sqlQuery = `SELECT p.*,a.* FROM  ${schemaName}.${propertyTableName} AS p INNER JOIN  ${schemaName}.${apartmentTableName}  AS a ON p.property_ID=a.property_ID WHERE 1=1 `;

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

    console.log(sqlQuery);
    

    try {
        const [result,field] = await pool.query(sqlQuery,params);
      
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }



}

async function insertApartmentFeedback(property_ID,feedback){

    //if table is not created then create table
    await createApartmentFeedbackTable();

    const insertQuery = `INSERT INTO ${schemaName}.${apartmentFeedbackTableName} VALUES (?,?)`;

    try {
        
        const[result,field] = await pool.query(insertQuery,[property_ID,feedback]);
        console.log(result);
    } catch (error) {
        console.log(error);
        throw error;
    }


}

async function getApartmentByID(property_ID){

    const getQuery = `SELECT p.*,a.* FROM  ${schemaName}.${propertyTableName} AS p INNER JOIN  ${schemaName}.${apartmentTableName} AS a ON p.property_ID=${property_ID} `;

    try {
        const [result,field] = await pool.query(getQuery);
       
        return result[0];// return object not array
    } catch (error) {

       
        throw error;
        
    }

}






module.exports = {insertApartmentProperty,getApartmentProperty,insertApartmentFeedback,getApartmentByID}