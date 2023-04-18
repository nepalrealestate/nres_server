const {pool} = require("../../connection");

const buyerTableName = 'buyer';

async function createBuyer(name,email,password){

    //if table is not exists - create table
   
    const isTablePresent = await isTableExists(buyerTableName);
     console.log(isTablePresent);

    if(!isTablePresent){
        const query  = `CREATE TABLE ${buyerTableName} (name VARCHAR(255), email VARCHAR(255), password VARCHAR(255),UNIQUE(email) ) `;
        try {
            const [row,field] = await pool.query(query)
            console.log("Table Created");
            console.log(row);
        } catch (error) {
            console.log(error);
        }
        
    }

    //insert into table sql
    const insertQuery =  `INSERT INTO ${buyerTableName} (name,email,password) VALUES (?,?,?)`;
    try {
        const [result,field] = await pool.query(insertQuery,[name,email,password]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
    
   
   
    

}


async function findBuyer(email){
    const findQuery = ` SELECT  * FROM ${buyerTableName} WHERE email=? `;
    try {
        const [row,field] =  await pool.query(findQuery,[email]);
        return row[0];//this return only object no object inside array
    } catch (error) {
        console.log(error);
    }
   
}



module.exports={createBuyer,findBuyer};