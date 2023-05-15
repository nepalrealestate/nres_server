const { pool } = require("../../connection");


const passwordResetTokenTable ="passwordResetToken";

const schemaName = "nres_users";


//--------------------------------Create table--------------------------------------------------




async function createPasswordResetTable(){

    // createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    // expirationTime DATETIME ,
    // ipAddress VARCHAR(45),
    const createQuery = `CREATE TABLE  IF NOT EXISTS ${schemaName}.${passwordResetTokenTable} (
        
        id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
       
        expirationTime DATETIME,
        ipAddress VARCHAR(45),
        PRIMARY KEY (id)
        
    );`

    try {
        const [row,field] = await pool.query(createQuery);
        console.log(` Password Reset Table Created `)
    } catch (error) {
        throw error;
        
    }

}



async function insertIntoPasswordResetToken(id,token){

     // if table is not created then create

   await createPasswordResetTable();

   // insert into table 
   

    
   
   const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()+1).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');

const expireTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
console.log(expireTime);


   const insertQuery =  `INSERT INTO ${schemaName}.${passwordResetTokenTable} (id,token,createdTime,expirationTime,ipAddress) VALUES(?,?,NOW(),?,?)`;

   try {
       return await pool.query(insertQuery,[id,token,expireTime,null]);
       
        
   } catch (error) {

       
       
        throw error;
   }

}

async function updatePasswordResetTokenValue(id,token){

    
        const updateTokenQuery = `UPDATE ${schemaName}.${passwordResetTokenTable} SET token=${token} WHERE id=${id}`;
        try {
            return await pool.query(updateTokenQuery);

           
        } catch (error) {
            throw error;
            
        }

}

async function findPasswordResetTokenValue(id){

    const findQuery = `SELECT * FROM ${schemaName}.${passwordResetTokenTable} WHERE id=${id}`;

    try {
        const [result,field] = await pool.query(findQuery);
       
        return result[0];
    } catch (error) {
        throw error;
        
    }


}

async function deleteToken(id){
    const deleteQuery = `DELETE FROM ${schemaName}.${passwordResetTokenTable} WHERE id=${id} `;
    try {
        await pool.query(deleteQuery);
    } catch (error) {
        throw error;
    }
}





module.exports = {createPasswordResetTable,insertIntoPasswordResetToken,updatePasswordResetTokenValue,findPasswordResetTokenValue,deleteToken};

