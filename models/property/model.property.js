const { resourceLimits } = require("worker_threads");
const { pool } = require("../../connection");
const { isTableExists } = require("../commonModels");

const propertyTableName = "property";
const schemaName = "nres_property";
const userSchemaName = "nres_property";
const videoTableName = "video_link";
const requestedPropertyTableName = "requested_property";
const applyForListingTableName = "apply_listing";
const propertyTransactionsTable = "property_transactions";
const agentTableName = "agent";

const { propertyTable, userTable, unapprovedPropertyTable, views } = require("../tableName");
//--------------Create Table------------------------------------

// Create Property Table

async function createPropertyTable() {
  const sqlQuery = `CREATE TABLE IF NOT EXISTS ${propertyTable.property} 
    ( 

        user_id VARCHAR(36) NOT NULL,
        user_type ENUM('agent','seller','staff'),
        property_id INT NOT NULL PRIMARY KEY,
        property_type ENUM('house','apartment','land') NOT NULL,   
        property_name varchar(50),
        listed_for varchar(10) NOT NULL,
        price FLOAT,
        area_aana FLOAT,
        area_sq_ft FLOAT,
        facing_direction varchar(255),
        views INT DEFAULT 0,
        state varchar(255),
        district varchar(255),
        city varchar(255),
        ward_number INT,
        tole_name varchar(255),
        approved_by_id varchar(36),
        status ENUM('approved'),
        FOREIGN KEY (approved_by_id) REFERENCES ${userTable.staff}(id)
    
    )`;

  try {
    const [row, field] = await pool.query(sqlQuery);
    console.log(" Property Table Created");
    console.log(row);
  } catch (error) {
    console.log(error);
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



async function insertUnapprovedProperty(property,location,area) {


  //createApplyPropertyTable();

  // insert into property , location and area;
  //insert into property
  const insertProperty = `INSERT INTO ${propertyTable.unapproved_property} VALUES (?,?,?,?,?,0,?,null,CURRENT_DATE(),?,?,?,?)`;//0 IS  VIEWS - null video link
  const insertLocation = `INSERT INTO ${propertyTable.unapproved_property_location} VALUES (0,?,?,?,?,?,?,?,?)`;// 0 is AUTO INCREAMENT ID;
  const insertArea = `INSERT INTO ${propertyTable.unapproved_property_area} VALUES (0,?,?,?,?)`; // 0 id
  
  const propertyValue = Object.values(property);//
  const locationValue = Object.values(location);
  console.log(locationValue);
  const areaValue = Object.values(area);
 
  propertyValue.push(null)// no one approve when insertproperty
  propertyValue.push('pending');// status is pending when insert unapproved property

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("Transaction Started");

    await connection.query(insertProperty,propertyValue);
    await connection.query(insertLocation,locationValue);
    await connection.query(insertArea,areaValue);
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


// ------------Getting data -------------------------

async function getProperty(condition,limit=20,offSet=0){
  
  // there must be better ways to get data - i'm exploring

  // let getPropertyType =  `SELECT property_type from ${propertyTable.property}`;

  // const [resultType,fieldType] = await pool.query(getPropertyType);
  // console.log(resultType)
  // let property_type = resultType[0];
  // const viewName = `${property_type}_property`;
  // console.log(viewName)
  let sqlQuery = `SELECT p.property_id,p.property_type,p.property_name,p.listed_for,p.views,p.posted_date,p.property_image,l.state,l.city,l.ward_number from ${propertyTable.property} as p 
 inner join ${propertyTable.property_location}  as l on p.property_id=l.property_id 

`;

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

module.exports = {
  createPropertyTable,
  insertProperty,
  updatePropertyViews,
  createVideoLinkTable,
  insertVideoLink,
  insertIntoRequestedProperty,
  createApplyPropertyTable,
  insertUnapprovedProperty,
  getProperty
};
