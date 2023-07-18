const { pool } = require("../../connection");
const { chatTable } = require("../tableName");

async function getSingleStaffChat(id) {
  const sqlQuery = `SELECT sender_id,receiver_id,message,timestamp FROM ${chatTable.staff} WHERE sender_id = ? OR receiver_id = ? `;

  try {
    const [result, field] = await pool.query(sqlQuery, [id, id]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function insertStaffChat(sender_id, receiver_id, message) {
  const insertQuery = `INSERT INTO ${chatTable.staff} (sender_id,receiver_id,message) VALUES (?,?,?)`;

  try {
    const [response, field] = await pool.query(insertQuery, [
      sender_id,
      receiver_id,
      message,
    ]);
    return response;
  } catch (error) {
    throw error;
  }
}

async function insertStaffChatList(satff_id) {
  const insertQuery = `INSERT INTO ${chatTable.staff_list} (satff_id) VALUES(?)`;

  try {
    const [response, field] = await pool.query(insertQuery, [satff_id]);
    return response;
  } catch (error) {
    throw error;
  }
}

async function getStaffChatList() {
  const sqlQuery = `SELECT * FROM ${chatTable.staff_list}`;

  try {
    const [response, field] = await pool.query(sqlQuery);
    return response;
  } catch (error) {
    throw error;
  }
}


async function insertStaffGroup(staff_id){
    const sqlQuery = `INSERT INTO ${chatTable.staff_group} (staff_id) VALUES (?)`;
    try {
        const [response, field] = await pool.query(sqlQuery,[staff_id]);
        return response;
      } catch (error) {
        throw error;
      }
    
}

async function  deleteStaffFromGroup(staff_id){
    const sqlQuery =  `DELETE FROM  ${chatTable.staff_group} WHERE staff_id = ?`;

    try {
        const [response, field] = await pool.query(sqlQuery,[staff_id]);
        return response;
      } catch (error) {
        throw error;
      }
}

module.exports = {
 getSingleStaffChat,
 insertStaffChat,
 insertStaffChatList,
 getStaffChatList,
 insertStaffGroup,
 deleteStaffFromGroup
};
