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



function houseModel (sequelize,DataTypes){
  return House = sequelize.define('property_house',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      primaryKey:true,
    },
    property_type :{
      type:DataTypes.ENUM('commercial','residential','office')
    },
    property_name : {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty: true, 
      }
    },
    listed_for :{
      type:DataTypes.ENUM('sell','rent')
    },
   
    property_age:{
      type:DataTypes.INTEGER
    },
    floor:{
      type:DataTypes.FLOAT
    },
    bedrooms:{
      type:DataTypes.INTEGER
    },
    kitchen:{
      type:DataTypes.INTEGER
    },
    bathrooms_attached:{
      type:DataTypes.INTEGER
    },
    bathrooms_common:{
      type:DataTypes.INTEGER
    },
    facing:{
      type:DataTypes.ENUM('east','west','north','south','east-north','east-south','west-north','west-south')
    },
    province:{
      type:DataTypes.STRING
    },
    district:{
      type:DataTypes.STRING
    },
    municipality:{
      type:DataTypes.STRING
    },
    ward:{
      type:DataTypes.INTEGER
    },
    landmark:{
      type:DataTypes.STRING
    },
    latitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    longitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    property_area:{
      type:DataTypes.FLOAT
    },
    road_size:{
      type:DataTypes.FLOAT
    },
    price:{
      type:DataTypes.DECIMAL(12,2),
      allowNull:false
    },
    price_type:{
      type:DataTypes.ENUM('fixed','negotiable')
    },
    furnish:{
      type:DataTypes.ENUM('non-furnished','furnished','semi-furnished')
    },
    parking_bike:{
      type:DataTypes.INTEGER
    },
    parking_car:{
      type:DataTypes.INTEGER
    },
    amenities:{
      type:DataTypes.JSON
    },
    description:{
      type:DataTypes.TEXT
    },
    property_image:{
      type:DataTypes.JSON
    },
    property_video:{
      type:DataTypes.JSON
    },
    posted_date:{
      type:DataTypes.DATE
    },
    staff_id:{
      type:DataTypes.INTEGER,
       references:{
         model:'user_staffs',
         key :'staff_id'
       }
      
    },
    customer_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_customers',
        key :'customer_id'
      }
    },
    agent_id :{
      type:DataTypes.INTEGER,
      references:{
        model:'user_agents',
        key :'agent_id'
      }
    },
    views:{
      type:DataTypes.INTEGER,
      defaultValue:0

    }


  }
  ,{
    freezeTableName: true,
  }
  )
}


function pendingHouseModel (sequelize,DataTypes){
  return PendingHouse = sequelize.define('property_pending_house',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      autoIncrement:true,
      primaryKey:true,
    },
    property_type :{
      type:DataTypes.ENUM('commercial','residential','office')
    },
    property_name : {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty: true, 
      }
    },
    listed_for :{
      type:DataTypes.ENUM('sell','rent')
    },
   
    property_age:{
      type:DataTypes.INTEGER
    },
    floor:{
      type:DataTypes.FLOAT
    },
    bedrooms:{
      type:DataTypes.INTEGER
    },
    kitchen:{
      type:DataTypes.INTEGER
    },
    bathrooms_attached:{
      type:DataTypes.INTEGER
    },
    bathrooms_common:{
      type:DataTypes.INTEGER
    },
    facing:{
      type:DataTypes.ENUM('east','west','north','south','east-north','east-south','west-north','west-south')
    },
    province:{
      type:DataTypes.STRING
    },
    district:{
      type:DataTypes.STRING
    },
    municipality:{
      type:DataTypes.STRING
    },
    ward:{
      type:DataTypes.INTEGER
    },
    landmark:{
      type:DataTypes.STRING
    },
    latitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    longitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    property_area:{
      type:DataTypes.FLOAT
    },
    road_size:{
      type:DataTypes.FLOAT
    },
    price:{
      type:DataTypes.DECIMAL(12,2),
      allowNull:false
    },
    price_type:{
      type:DataTypes.ENUM('fixed','negotiable')
    },
    furnish:{
      type:DataTypes.ENUM('non-furnished','furnished','semi-furnished')
    },
    parking_bike:{
      type:DataTypes.INTEGER
    },
    parking_car:{
      type:DataTypes.INTEGER
    },
    amenities:{
      type:DataTypes.JSON
    },
    description:{
      type:DataTypes.TEXT
    },
    property_image:{
      type:DataTypes.JSON
    },
    property_video:{
      type:DataTypes.JSON
    },
    posted_date:{
      type:DataTypes.DATE
    },
    staff_id:{
      type:DataTypes.INTEGER,
       references:{
         model:'user_staffs',
         key :'staff_id'
       }
      
    },
    customer_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_customers',
        key :'customer_id'
      }
    },
    agent_id :{
      type:DataTypes.INTEGER,
      references:{
        model:'user_agents',
        key :'agent_id'
      }
    },
    views:{
      type:DataTypes.INTEGER,
      defaultValue:0

    }


  }
  ,{
    freezeTableName: true,
  })
}

  

function houseAdsModel (sequelize,DataTypes){
  return HouseAds = sequelize.define('property_house_ads',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_house',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    ads_status: {
      type: DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    }

  }
  ,{
    freezeTableName: true,
  })
}



function houseFeedbackModel(sequelize,DataTypes){
  return HouseFeedback = sequelize.define('property_house_feedback',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_house',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    customer_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_customers',
        key:'customer_id'
      }
    },

    feedback:{
      type:DataTypes.TEXT('tiny'),
      allowNull: false,
      validate: {
        notEmpty: true,
      }

    }
  }
  ,{
    freezeTableName: true,
  }
  )
}




function houseCommentModel(sequelize,DataTypes){
  return HouseComment = sequelize.define('property_house_comment',{
    comment_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_house',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_staffs', // replace with your Staff model name
        key: 'staff_id',
      },
      onDelete: 'CASCADE',
    },
    super_admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_superAdmins', // replace with your SuperAdmin model name
        key: 'superAdmin_id',
      },
      onDelete: 'CASCADE',
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull:false,
      validate:{
        notEmpty: true,
      }
    },
    is_private: {
      type: DataTypes.BOOLEAN,
    }
  }
  ,{
    freezeTableName: true,
  })
}



function houseViewsModel (sequelize,DataTypes){
  return HouseViewsCount = sequelize.define('property_house_views',{
    id :{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'property_house',
        key: 'property_id'
    }
    },
    latitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    longitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue:DataTypes.NOW
  },
  },{
    freezeTableName: true,
  }
  
  )
}


// --- Testing 1e for convert to sequelize

// create house model




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

  const shiftHouseQuery = `INSERT INTO ${propertyTable.house} (property_id, property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking,facing_direction,facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, posted_date, approved_by, customer_id, agent_id, views) 
  
  SELECT ?, property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking,facing_direction, facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, NOW(), ?, customer_id, agent_id, views FROM ${propertyTable.pending_house} WHERE property_id=?`;

  const updatePropertyID = `UPDATE ${propertyTable.property_id_tracker} SET property_id = property_id+1 WHERE id = ?`;

  const deleteHousetQuery = ` DELETE FROM ${propertyTable.pending_house} WHERE property_id = ? `;


  const insertHouseAds = `INSERT INTO ${propertyTable.houseAds} (property_id) VALUES(?)`;


  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("Transaction Started");

    const [rows, field] = await connection.query(getPropertyID);

    // Retrieve the value of newPropertyID from the result
    const newPropertyID = rows[0].newPropertyID;
    console.log("This is new id ", newPropertyID);

    await connection.query(shiftHouseQuery, [ newPropertyID, staff_id, property_id,  ]);
    await connection.query(updatePropertyID, [1]);
    await connection.query(deleteHousetQuery, [property_id]);
    await connection.query(insertHouseAds,[newPropertyID])
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




async function updateHouseAds (ads_status , property_id){

  const updateQuery = `UPDATE ${propertyTable.houseAds} SET ads_status=? WHERE property_id = ? `;

  try {
    const [row,field] = await pool.query(updateQuery,[ads_status,property_id]);
    return row;
  } catch (error) {
    throw error;
  }

}


async function insertHouseComment (property_id,staff_id,super_admin_id,comment,isPrivate){

  const insertQuery = `INSERT INTO ${propertyTable.houseComment} (property_id,staff_id,super_admin_id,comment,is_private) VALUES (?,?,?,?,?) `;

  try {
    const [row,field] = await pool.query(insertQuery,[property_id,staff_id,super_admin_id,comment,isPrivate]);
    return row;
  } catch (error) {
    throw error;
  }

}


async function getHouseComment (property_id,super_admin_id=null){

  let getQuery = `SELECT * FROM ${propertyTable.houseComment} WHERE   
  (property_id = ? AND is_private = 0) `;
  const params= [];
  params.push(property_id)
  if(super_admin_id){
    getQuery += `OR (property_id = ? AND is_private = 1 AND super_admin_id = ?)`
    params.push(super_admin_id)
  }

  try {
    const [row,field] = await pool.query(getQuery,params);
    console.log(row)
    return row;
  } catch (error) {
    throw error;
  }

}



module.exports = {
  houseModel,
  pendingHouseModel,
  houseCommentModel,
  houseFeedbackModel,
  houseAdsModel,
  houseViewsModel,
  insertHouseProperty,
  getHouseProperty,
  insertHouseFeedback,
  getHouseByID,
  getPendingHouseByID,
  insertPendingHouseProperty,
  getPendingHouseProperty,
  approveHouse,
  updateHouseAds,
  insertHouseComment,
  getHouseComment
};
