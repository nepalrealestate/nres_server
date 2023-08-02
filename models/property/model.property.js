const { resourceLimits } = require("worker_threads");
const { pool } = require("../../connection");
const { isTableExists } = require("../commonModels");
 const {logger} = require("../../utils/errorLogging/logging");
const propertyTableName = "property";
const schemaName = "nres_property";
const userSchemaName = "nres_property";
const videoTableName = "video_link";
const requestedPropertyTableName = "requested_property";
const applyForListingTableName = "apply_listing";
const propertyTransactionsTable = "property_transactions";
const agentTableName = "agent";


const { propertyTable, userTable, unapprovedPropertyTable, views } = require("../tableName");
const { ADDRGETNETWORKPARAMS } = require("dns");
const { options } = require("../../routes/users/route.customer");

//--------------Create Table------------------------------------

function propertyIdTrackerModel(sequelize,DataTypes){
   const PropertyIdTracker = sequelize.define('property_id_tracker',{
     id:{
      type:DataTypes.INTEGER,
      defaultValue:1,
      primaryKey:true,
      allowNull:false
     },
     property_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },{
    hooks:{
      afterSync : async ()=>{
        await PropertyIdTracker.findOrCreate({
          where: { id: 1 },
          defaults: { property_id: 1 }
        });
      }
    }
  }
  )
  return PropertyIdTracker;
}



// Create Property Table

async function createPropertyTable() {
  const sqlQuery = `CREATE TABLE IF NOT EXISTS${propertyTable.property}
  (   
  property_id INT NOT NULL PRIMARY KEY,
  property_type ENUM('house','apartment','land') NOT NULL,
  property_name varchar(50),
  listed_for varchar(10) NOT NULL,
  price  DECIMAL(12, 2),
  views INT DEFAULT 0,
  property_image JSON,
  property_video JSON,
  posted_date DATE,
  user_id VARCHAR(36) NOT NULL,
  user_type ENUM('agent','seller','staff'),
  approved_by_id varchar(36),
  status ENUM('approved'),
  FOREIGN KEY (approved_by_id) REFERENCES nres_users.staff(id)
  
  );`;

  try {
    const [row, field] = await pool.query(sqlQuery);
    
  } catch (error) {
    
    throw error;
  }
}


async function createPropertyLocationTable(){


 
  const sqlQuery = `CREATE TABLE IF NOT EXISTS ${propertyTable.property_location} (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    state varchar(20),
    district varchar(20),
    city varchar(25),
    ward_number INT,
    tole_name varchar(20),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    FOREIGN KEY (property_id) REFERENCES nres_property.property(property_id)
    );`;


    try {
      const [row, field] = await pool.query(sqlQuery);
      
  } catch (error) {
    
    throw error;
  }                 
  
}

async function createPropertyAreaTable(){

    const sqlQuery  = `CREATE TABLE IF NOT EXISTS ${propertyTable.property_area}(
      id INT PRIMARY KEY AUTO_INCREMENT,
      property_id INT NOT NULL,
      area_aana FLOAT,
      area_sq_ft FLOAT,
      road_access_ft FLOAT,
      FOREIGN KEY (property_id) REFERENCES nres_property.property(property_id)
      );`;

  try {
      const [row, field] = await pool.query(sqlQuery);
      
  } catch (error) {
    
    throw error;
  }                  
}


// create table for store youtube vide link
async function createVideoLinkTable() {
  const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${videoTableName} (

        video_ID varchar(255) NOT NULL UNIQUE,
        property_type varchar(255) NOT NULL,
        video nvarchar(4000) NOT NULL ,
        PRIMARY KEY(video_ID),


    )`;
  try {
    const [row, field] = await pool.query(sqlQuery);
    console.log("video Link Table created");
    return row;
  } catch (error) {
    throw error;
  }
}

// create table for store requested property by users

async function createRequestedPropertyTable() {
  const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${requestedPropertyTableName} 
    (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name varchar (50) NOT NULL,
        email varchar(50) ,
        phone_number varchar(20) NOT NULL,
        requested_for varchar(20) NOT NULL,
        property_type varchar(20) NOT NULL,
        urgency varchar(20) NOT NULL,
        price_range JSON,
        description varchar(500),
        province varchar(20) NOT NULL,
        district varchar(20) NOT NULL,
        municipality varchar(20) NOT NULL,
        ward_number INT
        
        
    )`;

  try {
    const [result, field] = await pool.query(sqlQuery);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


async function createApplyPropertyTable() {

  const createQuery = `CREATE TABLE IF NOT EXISTS ${propertyTable.apply_property} LIKE ${propertyTable.property};
                       ALTER TABLE ${propertyTable.apply_property}
                       ADD COLUMN IF NOT EXISTS status  ENUM('pending','approved','rejected') DEFAULT 'pending'`;

  try {
    await pool.query(createQuery);
  } catch (error) {
    throw error;
  }
}

//-------------------------------Insert Data------------------------------------

//insert value in property table
async function insertProperty(property, user_id, user_type) {

  const {
    property_id,
    property_type,
    property_name,
    listed_for,
    price,
    area_aana,
    area_sq_ft,
    facing_direction,
    state,
    district,
    city,
    ward_number,
    tole_name,
  } = { ...property };
  const views = 0;
  const status = "On Sale";

  const insertQuery = `INSERT INTO ${propertyTable.property}  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  try {
    const [result, field] = await pool.query(insertQuery, [
      user_id,
      user_type,
      property_id,
      property_type,
      property_name,
      listed_for,
      status,
      price,
      area_aana,
      area_sq_ft,
      facing_direction,
      views,
      state,
      district,
      city,
      ward_number,
      tole_name,
    ]);
    console.log(result);
  } catch (error) {
    console.log(error)
    console.log("error from property insert");
    throw error;
  }
}

async function updatePropertyViews(property_ID) {
  // update views by vaule   1

  const updateQuery = `UPDATE ${schemaName}.${propertyTableName} SET views=views+1 WHERE property_ID='${property_ID}'`;

  try {
    const [result, field] = await pool.query(updateQuery);
  } catch (error) {
    throw error;
  }
}

// insert video link

async function insertVideoLink(video_ID, property_type, videoLink) {
  await createVideoLinkTable();

  const insertQuery = `INSERT INTO ${schemaName}.${videoTableName} VALUES (?,?,?)`;

  try {
    await pool.query(insertQuery, [video_ID, property_type, videoLink]);
  } catch (error) {
    throw error;
  }
}

async function insertIntoRequestedProperty(property) {
  await createRequestedPropertyTable();

  const insertQuery = `INSERT INTO ${schemaName}.${requestedPropertyTableName} (
        id,name,email,phone_number,requested_for,property_type,urgency,price_range,description,province,district,municipality,ward_number
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const insertValue = Object.values(property); // return value of array;
  insertValue.unshift(0);

  console.log(insertValue);

  try {
    const [result, field] = await pool.query(insertQuery, insertValue);
    return result;
  } catch (error) {
    throw error;
  }
}



async function insertPendingProperty(property, location,insertPropertyCallback) {


  //createApplyPropertyTable();

  // insert into property , location and area;
  //insert into property
  const insertProperty = `INSERT INTO ${propertyTable.pending_property} VALUES (?,?,?,?,?,?,?,?,?,null,CURRENT_DATE(),?,?)`;
  const insertLocation = `INSERT INTO ${propertyTable.pending_property_location} VALUES (0,?,?,?,?,?,?,?,?)`;// 0 is AUTO INCREAMENT ID;
 

  const propertyValue = Object.values(property);
  const locationValue = Object.values(location);


  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("Transaction Started for insert property");

    await connection.query(insertProperty, propertyValue);
    await connection.query(insertLocation, locationValue);
    await insertPropertyCallback(connection)
    await connection.commit();

    console.log('Transaction committed successfully for insert property');

  } catch (error) {
    console.log("error occur , rollback")
    await connection.rollback();
    console.log(error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }

}


async function approveProperty(property_id,approved_by,shiftPropertyCallback){

    
  const shiftPropertyQuery = `INSERT INTO ${propertyTable.property}
  (property_id, property_type, property_name, listed_for, price, area_aana, area_sq_ft,
  road_access_ft, property_image, property_video, posted_date, approved_by, customer_id, agent_id)
  SELECT
    property_id, property_type, property_name, listed_for, price, area_aana, area_sq_ft,
    road_access_ft, property_image, property_video, posted_date, ?, customer_id, agent_id
  FROM ${propertyTable.pending_property} WHERE property_id = ?`;


  const shiftLocationQuery = `INSERT INTO ${propertyTable.property_location}  SELECT *
  FROM ${propertyTable.pending_property_location}
  WHERE property_id = ?`;


  const deletePropertyQuery = `DELETE FROM ${propertyTable.pending_property} WHERE property_id = ?`;
  const deleteLocationQuery = `DELETE FROM ${propertyTable.pending_property_location} WHERE property_id = ?`;

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    console.log("before upate property");
     await connection.query(shiftPropertyQuery,[property_id,approved_by]);
     console.log("after update property")
     console.log(shiftPropertyQuery)
     await connection.query(shiftLocationQuery,[property_id]);
    
     await shiftPropertyCallback(connection,property_id);
     console.log("after Update apartment");
     await connection.query(deleteLocationQuery,[property_id]);
     await connection.query(deletePropertyQuery,[property_id]);


     await connection.commit();

  } catch (error) {
    
    await connection.rollback();
      console.log("Error Occur Roll back")
        console.log(error);
        throw error;
  }finally{
    if(connection){
        connection.release();
    }
}



}









// ------------Getting data -------------------------

async function getProperty(condition, limit = 20, offSet = 0) {


  let sqlQuery = `SELECT * FROM ${views.latest_property_dashboard} WHERE 1=1 `

  const params = [];
  //adding search conditon on query
  for (let key of Object.keys(condition)) {



    if (condition[key]) {
      // adding search conditon and  push value in params array;
      sqlQuery += ` AND ${key} = ?`
      params.push(condition[key]);
    }

  }

  //after adding search condition query

  sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`




  try {
    const [result, field] = await pool.query(sqlQuery, params);

    return result;
  } catch (error) {

    throw error;
  }

}



async function getLatestPropertyDashboard (condition, limit = 20, offSet = 0){

    



  let sqlQuery = `SELECT * FROM ${views.latest_property_dashboard} WHERE 1=1 `

  const params = [];
  //adding search conditon on query
  for (let key of Object.keys(condition)) {


    if(key==='property_type' || key === 'listed_for' || key === 'ads_status'){
      if (condition[key]) {
        // adding search conditon and  push value in params array;
        sqlQuery += ` AND ${key} = ?`
        params.push(condition[key]);
      }
    }else if(key==='location'){
      if(condition[key]){
        sqlQuery += ` AND CONCAT_WS(' ', city,ward_number,tole_name) LIKE ?`
        params.push(`%${condition[key]}%`);
      }
    }
    else{
      if (condition[key]) {
        // adding search conditon and  push value in params array;
        sqlQuery += ` AND ${key} LIKE  ?`
        params.push(`%${condition[key]}%`);
      }
    }
    


  }

  //after adding search condition query

  sqlQuery += ` ORDER BY posted_date DESC LIMIT ${limit} OFFSET ${offSet}`


  console.log(sqlQuery,params)

  try {
    const [result, field] = await pool.query(sqlQuery, params);

    return result;
  } catch (error) {

    throw error;
  }
}


module.exports = {
  propertyIdTrackerModel,
  createPropertyTable,
  insertProperty,
  updatePropertyViews,
  createVideoLinkTable,
  insertVideoLink,
  insertIntoRequestedProperty,
  createApplyPropertyTable,
  insertPendingProperty,
  getProperty,
  approveProperty,
  getLatestPropertyDashboard
};
