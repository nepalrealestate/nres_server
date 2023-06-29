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

async function registerAgent(values) {
  

  const insertQuery = `INSERT INTO ${userTable.agent} (name,email,phone_number,identification_type,identification_number,identification_image,password) VALUES (?,?,?,?,?,?,?)`;
  try {
    const [result, field] = await pool.query(insertQuery,values);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}







// -------insert data ----------------




//---------------------------Get Data---------------------

async function findAgent(email) {
  const findQuery = ` SELECT  * FROM ${userTable.agent} WHERE email=? `;
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
  FROM ${userTable.agent} AS a 
  LEFT JOIN ${userTable.agentRating} AS r 
  ON a.id = r.agent_id 
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
  const updateQuery = `UPDATE ${userTable.agent} SET password='${hashPassword}' WHERE id=${id}`;
  try {
    return await pool.query(updateQuery,[hashPassword,id]);
  } catch (error) {
    throw error;
  }
}

module.exports = { registerAgent, findAgent, updateAgentPassword ,getAgent };
