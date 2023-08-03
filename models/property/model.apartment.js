const { Sequelize } = require("sequelize");
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

// apartmehnt model 
function apartmentModel (sequelize,DataTypes){
    return Apartment = sequelize.define('property_apartment',{
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
     bhk:{
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
    )
  }
  

function pendingApartmentModel (sequelize,DataTypes){

  return PendingApartment = sequelize.define('property_pending_apartment',{
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
   bhk:{
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
  })

}

 function apartmentAdsModel(sequelize,DataTypes){
  return ApartmentAds = sequelize.define('property_apartment_ads',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_apartments',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    ads_status: {
      type: DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    }

  })
}


 function apartmentFeedbackModel(sequelize,DataTypes){
  return ApartmentFeedback = sequelize.define('property_apartment_feedback',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_apartments',
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
      },

    }

  })
}



function apartmentCommentModel(sequelize,DataTypes){
  return ApartmentComment = sequelize.define('property_apartment_comment',{
    comment_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_apartments',
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
    },


  })
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


    let sqlQuery =   `SELECT  LPAD(property_id, 4, "0")AS property_id,property_name,listed_for,price,views,city,ward_number,tole_name FROM ${propertyTable.apartment} WHERE 1=1 `;

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

    const getPropertyID = `SELECT LPAD(property_id, 4, "0") AS newPropertyID FROM ${propertyTable.property_id_tracker}`;
  
    const shiftApartmentQuery = `INSERT INTO ${propertyTable.apartment} (property_id, property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking, facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, posted_date, approved_by, customer_id, agent_id, views) 
    
    SELECT ?, property_name, listed_for, price, bedrooms, livingrooms, kitchen, floor, furnish, parking, facilities, area_aana, area_sq_ft, road_access_ft, state, district, city, ward_number, tole_name, latitude, longitude, property_image, property_video, NOW(), ?, customer_id, agent_id, views FROM ${propertyTable.pending_apartment} WHERE property_id=?`;

    const updatePropertyID = `UPDATE ${propertyTable.property_id_tracker} SET property_id = property_id+1 WHERE id = ?`;

    const deleteApartmentQuery = ` DELETE FROM ${propertyTable.pending_apartment} WHERE property_id = ? `;

    const insertApartmentAds = `INSERT INTO ${propertyTable.apartmentAds} (property_id) VALUES(?)`;

    let connection;

    try {

        connection =await pool.getConnection();
        await connection.beginTransaction();
        console.log("transaction started for shift apartment");
        
        const [rows, fields] = await connection.query(getPropertyID);

        // Retrieve the value of newPropertyID from the result
        const newPropertyID = rows[0].newPropertyID;
        console.log("This is new id " , newPropertyID)

        await  connection.query(shiftApartmentQuery,[newPropertyID,staff_id,property_id]);
        await connection.query(updatePropertyID,[1]);
        await connection.query(deleteApartmentQuery,[property_id]);
        await connection.query(insertApartmentAds,[newPropertyID]);
        await connection.commit();
        console.log("Transaction successfully ");

    } catch (error) {
        connection.rollback();
        console.log("error happen rollback");
        throw error;
    }finally{
        if(connection){
            connection.close();
        }
    }

  
    
}




const updateApartmentAds  = async function (ads_status , property_id){

    const updateQuery = `UPDATE ${propertyTable.apartmentAds} SET ads_status=? WHERE property_id = ? `;
  
    try {
      const [row,field] = await pool.query(updateQuery,[ads_status,property_id]);
      return row;
    } catch (error) {
      throw error;
    }
  
  }




async function insertApartmentComment (property_id,staff_id,super_admin_id,comment,isPrivate){

    const insertQuery = `INSERT INTO ${propertyTable.apartmentComment} (property_id,staff_id,super_admin_id,comment,is_private) VALUES (?,?,?,?,?) `;
  
    try {
      const [row,field] = await pool.query(insertQuery,[property_id,staff_id,super_admin_id,comment,isPrivate]);
      return row;
    } catch (error) {
      throw error;
    }
  
  }



  async function getApartmentComment (property_id,super_admin_id=null){

    let getQuery = `SELECT * FROM ${propertyTable.apartmentComment} WHERE   
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
    apartmentModel,
    apartmentAdsModel,
    apartmentFeedbackModel,
    apartmentCommentModel,
    pendingApartmentModel,
    insertApartmentProperty,
    getApartmentProperty,
    insertApartmentFeedback,
    getApartmentByID,
    insertPendingApartmentProperty,
    getPendingApartmentProperty,
    approveApartment,
    getPendingApartmentByID,
    updateApartmentAds,
    insertApartmentComment,
    getApartmentComment
};