const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const { createPasswordResetTable,insertIntoPasswordResetToken } = require("./model.commonUsersCode");

const agentTableName = 'agent';
const schemaName = 'nres_users';
const agentResetTokenTable = 'agentPasswordResetTokens'

async function registerAgent(name,email,password){

    const query  = `CREATE TABLE IF NOT EXISTS ${schemaName}.${agentTableName} ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255), email VARCHAR(255), password VARCHAR(255),UNIQUE(email) ) `;
        try {
            const [row,field] = await pool.query(query)
            console.log("Table Created");
            console.log(row);
        } catch (error) {
            console.log(error);
        }
        


    const insertQuery =  `INSERT INTO ${schemaName}.${agentTableName} (id,name,email,password) VALUES (?,?,?,?)`;
    try {
        const [result,field] = await pool.query(insertQuery,[0,name,email,password]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }


   




}



async function findAgent(email){
    const findQuery = ` SELECT  * FROM ${schemaName}.${agentTableName} WHERE email=? `;
    try {
        const [row,field] =  await pool.query(findQuery,[email]);
        return row[0];//this return only object no object inside array
    } catch (error) {
        console.log(error);
    }
}

async function updateAgentPassword(id,hashPassword){
    const updateQuery = `UPDATE ${schemaName}.${agentTableName} SET password='${hashPassword}' WHERE id=${id}`;
    try {
        await pool.query(updateQuery);

    } catch (error) {
       throw error; 
    }
}






module.exports = {registerAgent,findAgent,updateAgentPassword};