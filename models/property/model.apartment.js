const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty} = require("../property/models.property");
const propertyTableName = 'Property'
const houseTableName = 'House';
const landTableName = 'Land';
const apartmentTableName = 'Apartment';
const apartmentFeedbackTableName = 'ApartmentFeedback';


// Create Apartment Table

async function createApartmentTable (){

    // create property table before apartment table
    await createPropertyTable();

    const sqlQuery = `CREATE TABLE  IF NOT EXISTS ${apartmentTableName} 
    (
        property_ID INT,
        bhk INT,
        situated_floor INT,
        furnish_status BOOL,
        parking BOOL,
        facilities VARCHAR(1000),
        FOREIGN KEY (property_ID) references Property(property_ID)
    
    )`;

    try {
        const[row,field] = await pool.query(sqlQuery);
        console.log("Table Created");
        console.log(row);
    } catch (error) {
        console.log(error);
    }
}

async function createApartmentFeedbackTable(){

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${apartmentFeedbackTableName} (

        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        feedback TINYTEXT,
        FOREIGN KEY (property_ID) references ${apartmentTableName}(property_ID)
    )`;

    try {
        const [row,field] = await pool.query(sqlQuery);
        console.log(row);
        
    } catch (error) {
        console.log(error);
        throw error;
    }

    

}


async function insertApartmentProperty(property,apartmentProperty){

    // if table is not create then create table
    await createApartmentTable();

    // insert property object data in property
    await insertProperty(property);

   

    const {property_ID,bhk,situated_floor,furnish_status,parking,facilities} = apartmentProperty;

    const insertQuery = `INSERT INTO ${apartmentTableName} VALUES (?,?,?,?)`;

    try {
        
        const [result,field] = await pool.query(insertQuery,[property_ID,bhk,situated_floor,furnish_status,parking,facilities]);
        console.log(result);

    } catch (error) {
        
        console.log(error);

    }


}



async function getApartmentProperty(condition,limit,offSet){


    let sqlQuery = `SELECT p.*,a.* FROM ${propertyTableName} AS p INNER JOIN ${apartmentTableName} AS a ON p.property_ID=a.property_ID WHERE 1=1 `;

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
    }



}

async function insertApartmentFeedback(property_ID,feedback){

    await createApartmentFeedbackTable();

    const insertQuery = `INSERT INTO ${apartmentFeedbackTableName} VALUES (?,?)`;

    try {
        
        const[result,field] = await pool.query(insertQuery,[property_ID,feedback]);
        console.log(result);
    } catch (error) {
        console.log(error);
        throw error;
    }


}




module.exports = {insertApartmentProperty,getApartmentProperty,insertApartmentFeedback}