const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");


async function registerAgent(name,email,password){

    //if table is not exists - create table
    
    if(isTableExists('agent')===false){
        const query  = "CREATE TABLE agent (name VARCHAR(255), email VARCHAR(255), password VARCHAR(255),UNIQUE(email) ) ";
        try {
            const [row,field] = await pool.query(query)
            console.log("Table Created");
            console.log(row);
        } catch (error) {
            console.log(error);
        }
        
    }

    const insertQuery =  `INSERT INTO agent (name,email,password) VALUES (?,?,?)`;
    try {
        const [result,field] = await pool.query(insertQuery,[name,email,password]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }


   




}



async function findAgent(email){
    const findQuery = ` SELECT  * FROM agent WHERE email=? `;
    try {
        const [row,field] =  await pool.query(findQuery,[email]);
        return row[0];//this return only object no object inside array
    } catch (error) {
        console.log(error);
    }
}




module.exports = {registerAgent,findAgent};