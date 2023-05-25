const { pool } = require("../../connection");
const { isTableExists } = require("../commonModels");
const {
  createPasswordResetTable,
  insertIntoPasswordResetToken,
} = require("./model.commonUsersCode");

const agentTableName = "agent";
const schemaName = "nres_users";
const userRatingTable = "usersRating"
const {propertyTable,userTable}= require("../tableName")

// --------inserting 

async function registerAgent(agentData) {
  const query = `CREATE TABLE IF NOT EXISTS ${schemaName}.${agentTableName} 
    
    (
    id varchar(36) UNIQUE PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50), 
    phone_number VARCHAR(10), 
    identification_type VARCHAR(20),
    identification_number VARCHAR(20),
    identification_image JSON,
    password VARCHAR(255),
    UNIQUE(email)
    
    ) `;
  try {
    const [row, field] = await pool.query(query);
    console.log("Table Created");
    console.log(row);
  } catch (error) {
    console.log(error);
  }
  console.log(agentData.identification_image)

  const insertQuery = `INSERT INTO ${schemaName}.${agentTableName} (id,name,email,phone_number,identification_type,identification_number,identification_image,password) VALUES (uuid(),?,?,?,?,?,?,?)`;
  try {
    const [result, field] = await pool.query(insertQuery, [
      agentData.fullName,
      agentData.email,
      agentData.phoneNumber,
      agentData.identificationType,
      agentData.identificationNumber,
      agentData.identificationImage,      //`{"front":${agentData.identification_image.front},"back":${agentData.identification_image.back}}`,
      agentData.password,
    ]);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}







// -------insert data ----------------




//---------------------------Get Data---------------------

async function findAgent(email) {
  const findQuery = ` SELECT  * FROM ${schemaName}.${agentTableName} WHERE email=? `;
  try {
    const [row, field] = await pool.query(findQuery, [email]);
    return row[0]; //this return only object no object inside array
  } catch (error) {
    console.log(error);
  }
}

// return all agent data include - rating , total property except password
async function getAgent(id){

  const getQuery  = `SELECT a.name, a.email, a.phone_number,  ROUND(AVG(r.rating), 1) AS rating,
  COUNT(r.rating) AS ratingCount
  FROM ${schemaName}.${agentTableName} AS a 
  INNER JOIN ${schemaName}.${userRatingTable} AS r 
  ON a.id = r.user_id 
  WHERE a.id = ? 
  GROUP BY a.name, a.email, a.phone_number
 `;

  try {
    const [result,field] = await pool.query(getQuery,[id]);
    console.log(result[0])
    return result[0];
  } catch (error) {
    throw error;
  }

}



// ---------------------------Update Data--------------------------
async function updateAgentPassword(id, hashPassword) {
  const updateQuery = `UPDATE ${schemaName}.${agentTableName} SET password='${hashPassword}' WHERE id=${id}`;
  try {
    return await pool.query(updateQuery);
  } catch (error) {
    throw error;
  }
}

module.exports = { registerAgent, findAgent, updateAgentPassword ,getAgent };
