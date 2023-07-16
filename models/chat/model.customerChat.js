
const { pool } = require("../../connection");
const { chatTable } = require("../tableName");


async function getSingleCustomerChat(id){

    const sqlQuery = `SELECT sender_id,receiver_id,message,timestamp FROM ${chatTable.customer} WHERE sender_id = ? OR receiver_id = ? `;

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

async function insertCustomerList(customer_id){
    const insertQuery = `INSERT INTO ${chatTable.customer_list} (customer_id) VALUES(?)`;

    try {
        const [response,field]  = await pool.query(insertQuery,[customer_id]);
        return response;
    } catch (error) {
        throw error;
    }
}


async function getCustomerChatList(){
        
        const sqlQuery = `SELECT * FROM ${chatTable.customer_list}`;

        try {
            const [response,field] = await pool.query(sqlQuery);
            return response;
        } catch (error) {
            throw error;
        }
}






module.exports = {getSingleCustomerChat,insertCustomerChat,insertCustomerList,getCustomerChatList}