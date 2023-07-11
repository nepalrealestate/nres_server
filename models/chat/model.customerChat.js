
const { pool } = require("../../connection");
const { chatTable } = require("../tableName");


async function getSingleCustomerChat(id){

    const sqlQuery = `SELECT * FROM ${chatTable.customer} WHERE sender_id = ? OR receiver_id = ? `;

    try {
        const [result,field] = await pool.query(sqlQuery,[id,id]);
        return result;
    } catch (error) {
        throw error;
    }

}


async function insertCustomerChat(sender_id,receiver_id,message){
    
        const insertQuery = `INSERT INTO ${chatTable.customer} (sender_id,receiver_id,message) VALUES (?,?,?)`;

        try {
            const [response,field] = await pool.query(insertQuery,[sender_id,receiver_id,message]);
            return response;
        } catch (error) {
            throw error;
        }
}


module.exports = {getSingleCustomerChat,insertCustomerChat}