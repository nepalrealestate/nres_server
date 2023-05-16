const { pool } = require("../../connection");
const { isTableExists } = require("../commonModels");
const {
  createPasswordResetTable,
  insertIntoPasswordResetToken,
} = require("./model.commonUsersCode");

const agentTableName = "agent";
const schemaName = "nres_users";

async function registerAgent(agentData) {
  const query = `CREATE TABLE IF NOT EXISTS ${schemaName}.${agentTableName} 
    
    (
        id varchar(36) UNIQUE PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255), 
    phone_number VARCHAR(10), 
    identification_type VARCHAR(20),
    identification_number VARCHAR(20),
    identification_image VARCHAR(255),
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

  const insertQuery = `INSERT INTO ${schemaName}.${agentTableName} (id,name,email,phone_number,identification_type,identification_number,identification_image,password) VALUES (uuid(),?,?,?,?,?,?,?)`;
  try {
    const [result, field] = await pool.query(insertQuery, [
      agentData.name,
      agentData.email,
      agentData.phone_number,
      agentData.identification_type,
      agentData.identification_number,
      agentData.identification_image,
      agentData.password,
    ]);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function findAgent(email) {
  const findQuery = ` SELECT  * FROM ${schemaName}.${agentTableName} WHERE email=? `;
  try {
    const [row, field] = await pool.query(findQuery, [email]);
    return row[0]; //this return only object no object inside array
  } catch (error) {
    console.log(error);
  }
}

async function updateAgentPassword(id, hashPassword) {
  const updateQuery = `UPDATE ${schemaName}.${agentTableName} SET password='${hashPassword}' WHERE id=${id}`;
  try {
    return await pool.query(updateQuery);
  } catch (error) {
    throw error;
  }
}

module.exports = { registerAgent, findAgent, updateAgentPassword };
