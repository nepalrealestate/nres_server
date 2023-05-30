const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const { propertyTable, views } = require("../tableName");
const {createPropertyTable,insertProperty, insertIntoRequestedProperty, insertIntoApplyForPropertyListing, createApplyPropertyTable, insertApplyProperty} = require("./model.property");
const propertyTableName = 'Property'
const houseTableName = 'House';
const houseFeedbackTableName = 'HouseFeedback';
const schemaName = 'nres_property';
const applyForHouseListingTable = 'applyHouseListing'; 


// --------------------- CREATE TABLE --------------

// Create House Table



async function createHouseTable(){
    //if not exists then create property table
    await createPropertyTable();
    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${propertyTable.house}
    (
        property_id INT NOT NULL PRIMARY KEY UNIQUE,
        room INT,
        floor FLOAT,
        furnish_status BOOL,
        parking BOOL,
        road_access_ft FLOAT,
        facilities VARCHAR(1000),
        house_image JSON,
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

// async function createApplyHouse(){

//     // create property table first  -if not created
//     await createApplyPropertyTable();

//     const createQuery =   `CREATE TABLE IF NOT EXISTS ${propertyTable.apply_house} LIKE ${propertyTable.house}`;

//     try {
//         const[row,field] = await pool.query(createQuery);
//         console.log("Table Created");
//         return row;
//     } catch (error) {
//        throw error;
//     }



// }

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

//------------------INSERT DATA----------

async function insertHouseProperty(property,houseProperty,user_id,user_type){

   

   await createHouseTable();

   //two different object recieve for store data 
   await insertProperty(property,user_id,user_type);

   

   const { property_ID,room,floor,furnish_status,parking,road_access_ft,facilities,house_image } = houseProperty;

   const insertQuery = `INSERT INTO ${propertyTable.house} VALUES (?,?,?,?,?,?,?,?)`;

   try {
       const [result,field] = await pool.query(insertQuery,[property_ID,room,floor,furnish_status,parking,road_access_ft,facilities,house_image])
       return result;
   } catch (error) {

      
       throw error;
       
   }


}

// insert into apply house for listing request


async function insertApplyHouseProperty(property,houseProperty,user_id,user_type){

        
        const {property_id,room,floor,furnish_status,parking,road_access_ft,facilities,house_image} = houseProperty;

        const insertQuery  =   `INSERT INTO ${propertyTable.apply_house} VALUES (?,?,?,?,?,?,?,?)`;
        
        try {
            
            await insertApplyProperty(property,user_id,user_type);
            const[result,field] = await pool.query(insertQuery,[property_id,room,floor,furnish_status,parking,road_access_ft,facilities,house_image])
            return result;

        } catch (error) {
            throw error;
        }finally{

        }

}



async function getHouseProperty(condition,limit,offSet){


    let sqlQuery =  `SELECT property_id,property_name,listed_for,price,views,city,ward_number,tole_name,house_image FROM ${views.fullHouseView} WHERE 1=1 `;

    const params = [];
    //adding search conditon on query
    for(let key of Object.keys(condition)){

       

        if(condition[key]){
            // adding search conditon and  push value in params array;
            sqlQuery += ` AND ${key} = ?`
            params.push(condition[key]);
        }

    }

    //after adding search condition query

    sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`

    
    

    try {
        const [result,field] = await pool.query(sqlQuery,params);
      
        return result;
    } catch (error) {
      
        throw error;
    }



}

async function getApplyHouseProperty(condition,limit,offSet){

    let sqlQuery  = `SELECT * FROM ${views.applyHouseView} WHERE 1=1 `;

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





async function getHouseByID(property_id){

    const getQuery = `SELECT * FROM ${views.fullHouseView} WHERE property_id = ?`
    console.log(getQuery)

    try {
        const [result,field] = await pool.query(getQuery,[property_id]);
        return result[0];// return object not array
        } catch (error) {
        throw error;
    }

}


async function getApplyHouseByID(property_id){

    const getQuery = `SELECT * FROM ${views.applyHouseView} WHERE property_id = ?`
    console.log(getQuery)

    try {
        const [result,field] = await pool.query(getQuery,[property_id]);
        return result[0];// return object not array
        } catch (error) {
        throw error;
    }

}




// update

// approve apply property and shift to property table

async function approveHouse(staff_id,property_id){

    const updateQuery = `UPDATE ${propertyTable.apply_property} SET status='approved',approved_by_id=? WHERE property_id=?`;
    const shiftPropertyQuery = `INSERT INTO ${propertyTable.property} SELECT * FROM ${propertyTable.apply_property} WHERE property_id=?`;
    const shiftHouseQuery = `INSERT INTO ${propertyTable.house} SELECT * FROM ${propertyTable.apply_house} WHERE property_id=?`;
    const deleteHouseQuery = ` DELETE FROM ${propertyTable.apply_house} WHERE property_id = ? `;
    const deletePropertyQuery = ` DELETE FROM ${propertyTable.apply_property}  WHERE property_id = ? `;
   

    let connection ;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        console.log("Transaction Started");

        await connection.query(updateQuery,[staff_id,property_id]);
        await connection.query(shiftPropertyQuery,[property_id]);
        await connection.query(shiftHouseQuery,[property_id]);
        await connection.query(deleteHouseQuery,[property_id]);// first delete apartment and then property
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





module.exports = {insertHouseProperty,getHouseProperty,insertHouseFeedback,getHouseByID,getApplyHouseByID,
    insertApplyHouseProperty,getApplyHouseProperty,approveHouse}


