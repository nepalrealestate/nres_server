const { pool } = require("../../connection");


const passwordResetTokenTable ="passwordResetToken";
const schemaName = "nres_users";


async function createPasswordResetTable(){

    // createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    // expirationTime DATETIME ,
    // ipAddress VARCHAR(45),
    const createQuery = `CREATE TABLE  IF NOT EXISTS ${schemaName}.${passwordResetTokenTable} (
        
        id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
       
        isUsed BOOLEAN  DEFAULT 0,
       
       
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
   const date = new Date();



   const insertQuery =  `INSERT INTO ${schemaName}.${passwordResetTokenTable} (id,token,isUsed) VALUES(?,?,?)`;

   try {
        await pool.query(insertQuery,[id,token,0]);
       
        
   } catch (error) {

       
       
        throw error;
   }

}

async function updatePasswordResetTokenValue(id,token){

    
        const updateTokenQuery = `UPDATE ${schemaName}.${passwordResetTokenTable} SET token=${token} WHERE id=${id}`;
        try {
            const[result,field] = await pool.query(updateTokenQuery);
           
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

