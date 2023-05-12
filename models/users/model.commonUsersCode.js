const { pool } = require("../../connection");



async function createPasswordResetTable(schemaName){

    // createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    // expirationTime DATETIME ,
    // ipAddress VARCHAR(45),
    const createQuery = `CREATE TABLE  IF NOT EXISTS ${schemaName}.passwordResetToken (
        
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



async function insertIntoPasswordResetToken(id,token,schemaName){

     // if table is not created then create

   await createPasswordResetTable(schemaName);

   // insert into table 
   const date = new Date();



   const insertQuery =  `INSERT INTO ${schemaName}.passwordResetToken (id,token,isUsed) VALUES(?,?,?)`;

   try {
        await pool.query(insertQuery,[id,token,0]);
       
        
   } catch (error) {

       
       
        throw error;
   }

}

async function updatePasswordResetTokenValue(id,token,schemaName){

    
        const updateTokenQuery = `UPDATE ${schemaName}.passwordResetToken SET token=${token} WHERE id=${id}`;
        try {
            const[result,field] = await pool.query(updateTokenQuery);
           
        } catch (error) {
            throw error;
            
        }

}

async function findPasswordResetTokenValue(id,schemaName){

    const findQuery = `SELECT * FROM ${schemaName}.passwordResetToken WHERE id=${id}`;

    try {
        const [result,field] = await pool.query(findQuery);
       
        return result[0];
    } catch (error) {
        throw error;
        
    }


}


module.exports = {createPasswordResetTable,insertIntoPasswordResetToken,updatePasswordResetTokenValue,findPasswordResetTokenValue};

