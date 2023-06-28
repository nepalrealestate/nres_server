const {pool} = require("../connection");
const { userTable } = require("./tableName");

function ModelUtility() {


  this.insertPasswordResetToken = async function (id, token) {
    // const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    // const day = String(currentDate.getDate() + 1).padStart(2, "0");
    // const hours = String(currentDate.getHours()).padStart(2, "0");
    // const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    // const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  //  const expireTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const insertQuery =  `INSERT INTO ${userTable.passwordResetToken} (id,token,createdTime,expirationTime,ipAddress) VALUES(?,?,NOW(),DATE_ADD(NOW(), INTERVAL 1 DAY),?)`;

    try {
        return await pool.query(insertQuery,[id,token,null]);
          
    } catch (error) {
 
         throw error;
    }


  }




  this.updatePasswordToken = async function (id,token){

    const updateTokenQuery =  `UPDATE ${userTable.passwordResetToken} SET token = ?, createdTime = NOW(), expirationTime = DATE_ADD(NOW(), INTERVAL 1 DAY), ipAddress = ? WHERE id = ?`;
    try {
        return await pool.query(updateTokenQuery,[token,null,id]);

       
    } catch (error) {
        throw error;
        
    }

  }



  this.findPasswordResetToken = async function (id){
    const findQuery = `SELECT * FROM ${userTable.passwordResetToken} WHERE id=?`;

    try {
        const [result,field] = await pool.query(findQuery,[id]);
       
        return result[0];
    } catch (error) {
        throw error;
        
    }
  }


  this.deleteToken = async function (id){
    const deleteQuery = `DELETE FROM ${userTable.passwordResetToken} WHERE id=? `;
    try {
        await pool.query(deleteQuery,[id]);
    } catch (error) {
        throw error;
    }
  }


}



module.exports = ModelUtility;