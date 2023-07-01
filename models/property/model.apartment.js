const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty, createApplyPropertyTable, insertApplyProperty, insertUnapprovedProperty, insertPendingProperty} = require("../property/model.property");
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


async function insertPendingApartmentProperty(property,apartmentProperty,location){


    //await createApplyApartmentTable();
    const insertValue = Object.values(apartmentProperty);
    const insertQuery = `INSERT INTO  ${propertyTable.pending_apartment}  VALUES (?,?,?,?,?,?) `;



    await insertPendingProperty(property,location,insertPendingApartment)
    
    async function insertPendingApartment(connection){
        console.log(insertQuery, insertValue)
       await connection.query(insertQuery,insertValue);

    }

    // let connection;

    // try {
    //     connection = await pool.getConnection();
    //     await connection.beginTransaction();
    //     console.log("Transaction Started");
    
    //     await insertUnapprovedProperty(property,location);
    //     await pool.query(insertQuery,insertValue);

    //     await connection.commit();

    //     console.log("Transaction committed successfully");
    
    //   } catch (error) {
    //     console.log("error occur , rollback")
    //     await connection.rollback();
    //     console.log(error);
    //     throw error;
    //   }finally{
    //     if(connection){
    //       connection.release();
    //   }
    //   }

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

async function getUnapprovedApartmentProperty(condition,limit,offSet){

    let sqlQuery  = `SELECT * FROM ${views.unapprovedApartmentView} WHERE 1=1 `;

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
      
        return result[0];
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

async function getUnapprovedApartmentByID(property_id){

    const getQuery =`SELECT * FROM ${views.unapprovedApartmentView} WHERE property_id = ?`

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

    // 

    const updateQuery = `UPDATE ${propertyTable.unapproved_property} SET status='approved',approved_by_id=? WHERE property_id=?`;
    const shiftPropertyQuery = `INSERT INTO ${propertyTable.property} SELECT * FROM ${propertyTable.unapproved_property} WHERE property_id=?`;
    const shiftLocationQuery = `INSERT INTO ${propertyTable.property_location} SELECT * FROM ${propertyTable.unapproved_property_location} 
                                WHERE property_id=?`;
    const shiftAreaQuery = `INSERT INTO ${propertyTable.property_area} SELECT * FROM ${propertyTable.unapproved_property_area}
                            WHERE property_id=?`;
    const shiftApartmentQuery = `INSERT INTO ${propertyTable.apartment} SELECT * FROM ${propertyTable.unapproved_apartment} WHERE property_id=?`;
    
    const deleteAreaQuery = `DELETE FROM ${propertyTable.unapproved_property_area} WHERE property_id= ?`;
    const deleteLocationQuery = `DELETE FROM ${propertyTable.unapproved_property_location} WHERE property_id = ?`;
    const deleteApartmentQuery = ` DELETE FROM ${propertyTable.unapproved_apartment} WHERE property_id = ? `;
    const deletePropertyQuery = ` DELETE FROM ${propertyTable.unapproved_property}  WHERE property_id = ? `;
    
    

    let connection ;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        console.log("Transaction Started");

        await connection.query(updateQuery,[staff_id,property_id]);
        await connection.query(shiftPropertyQuery,[property_id]);
        await connection.query(shiftApartmentQuery,[property_id]);
        await connection.query(shiftLocationQuery,[property_id]);//shift location
        await connection.query(shiftAreaQuery,[property_id]);// shift area
        await connection.query(deleteAreaQuery,[property_id]);// delete area
        await connection.query(deleteLocationQuery,[property_id]);// delete location
        await connection.query(deleteApartmentQuery,[property_id]);// first delete apartment and then property
        await connection.query(deletePropertyQuery,[property_id]);// delete property
        

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





module.exports = {insertApartmentProperty,
    getApartmentProperty,
    insertApartmentFeedback,
    getApartmentByID,
    insertPendingApartmentProperty,
    getUnapprovedApartmentProperty,
    approveApartment,
    getUnapprovedApartmentByID
};