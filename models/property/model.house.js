const { pool } = require("../../connection");
const { isTableExists } = require("../commonModels");
const { propertyTable, views } = require("../tableName");
const {
  createPropertyTable,
  insertProperty,
  insertUnapprovedProperty,
  insertPendingProperty,
} = require("./model.property");
const propertyTableName = "Property";
const houseTableName = "House";
const houseFeedbackTableName = "HouseFeedback";
const schemaName = "nres_property";
const applyForHouseListingTable = "applyHouseListing";

// --------------------- CREATE TABLE --------------

// Create House Table

async function createHouseTable() {
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
    const [row, field] = await pool.query(sqlQuery);
    console.log("Table Created");
    return row;
  } catch (error) {
    throw error;
  }
}

async function createHouseFeedbackTable() {
  const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${houseFeedbackTableName} (

        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        feedback TINYTEXT,
        FOREIGN KEY (property_ID) REFERENCES ${schemaName}.${houseTableName}(property_ID) ON DELETE CASCADE
    )`;

  try {
    const [row, field] = await pool.query(sqlQuery);
    return row;
  } catch (error) {
    throw error;
  }
}

//------------------INSERT DATA----------

async function insertHouseProperty(
  property,
  houseProperty,
  user_id,
  user_type
) {
  await createHouseTable();

  //two different object recieve for store data
  await insertProperty(property, user_id, user_type);

  const {
    property_ID,
    room,
    floor,
    furnish_status,
    parking,
    road_access_ft,
    facilities,
    house_image,
  } = houseProperty;

  const insertQuery = `INSERT INTO ${propertyTable.house} VALUES (?,?,?,?,?,?,?,?)`;

  try {
    const [result, field] = await pool.query(insertQuery, [
      property_ID,
      room,
      floor,
      furnish_status,
      parking,
      road_access_ft,
      facilities,
      house_image,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
}

// insert into apply house for listing request

async function insertPendingHouseProperty(houseProperty) {
  // insert house property query

  const insertValue = Object.values(houseProperty);

  const insertQuery = `INSERT INTO  ${propertyTable.pending_house} 
    (property_id,property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking,facing_direction,facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, posted_date, approved_by, customer_id, agent_id, views)

    
    VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?,?,?,0) `;

  try {
    const [result, field] = await pool.query(insertQuery, insertValue);
    return result;
  } catch (error) {
    throw error;
  }
}

async function getHouseProperty(condition, limit, offSet) {
  let sqlQuery = `SELECT * FROM ${propertyTable.house} WHERE 1=1 `;

  const params = [];
  //adding search conditon on query
  for (let key of Object.keys(condition)) {
    if (condition[key]) {
      // adding search conditon and  push value in params array;
      sqlQuery += ` AND ${key} = ?`;
      params.push(condition[key]);
    }
  }

  //after adding search condition query

  sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`;

  try {
    const [result, field] = await pool.query(sqlQuery, params);

    return result;
  } catch (error) {
    throw error;
  }
}

async function getPendingHouseProperty(condition, limit = 20, offSet = 0) {
  let sqlQuery = `SELECT * FROM ${propertyTable.pending_house} WHERE 1=1 `;

  const params = [];
  //adding search conditon on query
  for (let key of Object.keys(condition)) {
    if (condition[key]) {
      // adding search conditon and  push value in params array;
      sqlQuery += `AND ${key} = ?`;
      params.push(condition[key]);
    }
  }

  //after adding search condition query

  sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`;

  console.log(sqlQuery);

  try {
    const [result, field] = await pool.query(sqlQuery, params);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insertHouseFeedback(property_ID, feedback) {
  //if table is not create then create table
  await createHouseFeedbackTable();

  const insertQuery = `INSERT INTO ${schemaName}.${houseFeedbackTableName} VALUES (?,?)`;

  try {
    const [result, field] = await pool.query(insertQuery, [
      property_ID,
      feedback,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function getHouseByID(property_id) {
  const getQuery = `SELECT * FROM ${views.fullHouseView} WHERE property_id = ?`;
  console.log(getQuery);

  try {
    const [result, field] = await pool.query(getQuery, [property_id]);
    return result[0]; // return object not array
  } catch (error) {
    throw error;
  }
}

async function getPendingHouseByID(property_id) {
  const getQuery = `SELECT * FROM ${propertyTable.pending_house} WHERE property_id = ?`;
  console.log(getQuery);

  try {
    const [result, field] = await pool.query(getQuery, [property_id]);
    return result[0]; // return object not array
  } catch (error) {
    throw error;
  }
}

// update

// approve apply property and shift to property table

async function approveHouse(staff_id, property_id) {
  const getPropertyID = `SELECT LPAD(property_id, 4, "0") AS newPropertyID FROM ${propertyTable.property_id_tracker}`;

  const shiftHomeQuery = `INSERT INTO ${propertyTable.house} (property_id, property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking,facing_direction,facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, posted_date, approved_by, customer_id, agent_id, views) 
  
  SELECT ?, property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking,facing_direction, facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, NOW(), ?, customer_id, agent_id, views FROM ${propertyTable.pending_house} WHERE property_id=?`;

  const updatePropertyID = `UPDATE ${propertyTable.property_id_tracker} SET property_id = property_id+1 WHERE id = ?`;

  const deleteHousetQuery = ` DELETE FROM ${propertyTable.pending_house} WHERE property_id = ? `;

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("Transaction Started");

    const [rows, fields] = await connection.query(getPropertyID);

    // Retrieve the value of newPropertyID from the result
    const newPropertyID = rows[0].newPropertyID;
    console.log("This is new id ", newPropertyID);

    await connection.query(shiftHomeQuery, [ newPropertyID, staff_id, property_id,  ]);
    await connection.query(updatePropertyID, [1]);
    await connection.query(deleteHousetQuery, [property_id]);
    await connection.commit();
    console.log("Transaction successfully ");

    await connection.commit();
  } catch (error) {
    console.log("error occur , rollback");
    await connection.rollback();
    console.log(error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  insertHouseProperty,
  getHouseProperty,
  insertHouseFeedback,
  getHouseByID,
  getPendingHouseByID,
  insertPendingHouseProperty,
  getPendingHouseProperty,
  approveHouse,
};
