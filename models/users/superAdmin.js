const {pool}  = require("../../connection");
const {isTableExists} = require("../commonModels");

const superAdminTableName = 'superAdmin';

async function registerSuperAdmin(name,email,password){

     //if table is not exists - create table
    

    
     const isTablePresent = await isTableExists(superAdminTableName);
     console.log(isTablePresent);
     if(!isTablePresent){
        const query  = `CREATE TABLE ${superAdminTableName} (name VARCHAR(255), email VARCHAR(255), password VARCHAR(255),UNIQUE(email) ) `;
        try {
            const [row,field] = await pool.query(query)
            console.log("Table Created");
            console.log(row);
        } catch (error) {
            console.log("Console Error from try catch",error);
        }
        
    }

    const insertQuery =  `INSERT INTO ${superAdminTableName} (name,email,password) VALUES (?,?,?)`;
    try {
        const [result,field] = await pool.query(insertQuery,[name,email,password]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }

   

}

async function findSuperAdmin(email){
    const findQuery = ` SELECT  * FROM ${superAdminTableName} WHERE email=? `;
    try {
        const [row,field] =  await pool.query(findQuery,[email]);
        return row[0];//this return only object no object inside array
    } catch (error) {
        console.log(error);
    }
}


module.exports = {registerSuperAdmin,findSuperAdmin};