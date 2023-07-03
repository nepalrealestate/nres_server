const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty, createApplyPropertyTable, insertApplyProperty, insertUnapprovedProperty, insertPendingProperty, approveProperty} = require("../property/model.property");
const { propertyTable, views } = require("../tableName");
const propertyTableName = 'Property'
const houseTableName = 'House';
const landTableName = 'Land';
const apartmentTableName = 'Apartment';
const apartmentFeedbackTableName = 'ApartmentFeedback';
const schemaName = 'nres_property';


// ----------------------------CREATE APARTMENT DATA--------------------------------

async function createApartmentTable (){

    // create property table before apartment table
    await createPropertyTable();

    const sqlQuery = `CREATE TABLE  IF NOT EXISTS ${propertyTable.apartment}
    (
        property_id INT NOT NULL PRIMARY KEY UNIQUE,
        bhk INT,
        situated_floor INT,
        furnish_status BOOL,
        parking BOOL,
        facilities VARCHAR(1000),
        apartment_image JSON,
        FOREIGN KEY (property_id) REFERENCES ${propertyTable.property}(property_id) ON DELETE CASCADE
    
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


//create apartment table for applied property store

async function createApplyApartmentTable(){
    // if create apply property table
    await createApplyPropertyTable();

        const createQuery = `CREATE TABLE IF NOT EXISTS ${propertyTable.apply_apartment} LIKE ${propertyTable.apartment}`;
                             
      
        try {
          return await pool.query(createQuery);
        } catch (error) {
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

// -------------------------------- INSERT DATA-------------------------------


async function insertApartmentProperty(property,apartmentProperty,user_id,user_type){

    // if table is not create then create table
    await createApartmentTable();

    // insert property object data in property
    try {
        await insertProperty(property,user_id,user_type);
    } catch (error) {
        
        throw error;
    }
   
   
   console.log("property added successs")

    const {property_id,bhk,situated_floor,furnish_status,parking,facilities,apartment_image} = apartmentProperty;

    const insertQuery = `INSERT INTO  ${propertyTable.apartment}  VALUES (?,?,?,?,?,?,?,?) `;

    try {
        
        const [result,field] = await pool.query(insertQuery,[property_id,bhk,situated_floor,furnish_status,parking,facilities,apartment_image]);
       
        return result;

    } catch (error) {
        
      
        throw error;

    }


}


async function insertPendingApartmentProperty(apartmentProperty){


    //await createApplyApartmentTable();
    console.log(apartmentProperty)
    const insertValue = Object.values(apartmentProperty);
    console.log(insertValue)
    const insertQuery = `INSERT INTO  ${propertyTable.pending_apartment} 
    (property_id,property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking, facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, posted_date, approved_by, customer_id, agent_id, views)

    
    VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?,?,?,0) `;


    try {
        const [result,field] = await pool.query(insertQuery,insertValue);
        return result;
    } catch (error) {
        throw error;
    }


    // await insertPendingProperty(property,location,insertPendingApartment)
    
    // async function insertPendingApartment(connection){
        
    //    await connection.query(insertQuery,insertValue);

    // }


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




async function getApartmentProperty(condition,limit,offSet){


    let sqlQuery =   `SELECT property_id,property_name,listed_for,status,price,views,city,ward_number,tole_name,apartment_image FROM ${views.fullHouseView} WHERE 1=1 `;

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

    sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`

    console.log(sqlQuery);
    

    try {
        const [result,field] = await pool.query(sqlQuery,params);
      
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }



}

async function getPendingApartmentProperty(condition,limit,offSet){

    let sqlQuery  = `SELECT * FROM ${propertyTable.pending_apartment} WHERE 1=1 `;

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

    sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`

    console.log(sqlQuery);
    

    try {
        const [result,field] = await pool.query(sqlQuery,params);
      
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }


}



async function getApartmentByID(property_id){

    const getQuery =`SELECT * FROM ${views.fullApartmentView} WHERE property_id = ?`

    try {
        const [result,field] = await pool.query(getQuery,[property_id]);
       
        return result[0];// return object not array
    } catch (error) {

       
        throw error;
        
    }

}

async function getPendingApartmentByID(property_id){

    const getQuery =`SELECT * FROM ${propertyTable.pending_apartment} WHERE property_id = ?`

    try {
        const [result,field] = await pool.query(getQuery,[property_id]);
       
        return result[0];// return object not array
    } catch (error) {

       
        throw error;
        
    }

}


// update

// approve apply property and shift to property table

async function approveApartment(staff_id,property_id){



// -- Retrieve the value, add leading zeros, increment by 1, and insert into the property table
// INSERT INTO property (property_id, column1, column2, ...)
// VALUES (LPAD(@latest_property_id, 4, '0'), value1, value2, ...);

// -- Update the user-defined variable with the latest property ID
// SET @latest_property_id := @latest_property_id + 1;


  
    const shiftApartmentQuery = `INSERT INTO ${propertyTable.apartment} SELECT * FROM ${propertyTable.pending_apartment} WHERE property_id=?`;
    const deleteApartmentQuery = ` DELETE FROM ${propertyTable.pending_apartment} WHERE property_id = ? `;

    try {
       await approveProperty(property_id,staff_id,async function(connection,property_id){
   
            await connection.query(shiftApartmentQuery,[property_id]);
            //await connection.query(deleteApartmentQuery,[property_id]);//
       
       
    })
    } catch (error) {
        throw error;
    }

  
    
}





module.exports = {insertApartmentProperty,
    getApartmentProperty,
    insertApartmentFeedback,
    getApartmentByID,
    insertPendingApartmentProperty,
    getPendingApartmentProperty,
    approveApartment,
    getPendingApartmentByID
};