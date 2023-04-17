const {pool} = require("../connection");



async function createBuyer(name,email,password){

    //create table sql;
    // const sql = "CREATE TABLE buyer (name VARCHAR(255), email VARCHAR(255), password VARCHAR(255),UNIQUE(email) ) ";

    // connection.query(sql,function(err,result){
    //     if(err) throw err;
    //     console.log("Table Created");
    // })

    //insert into table sql
    const insertQuery =  `INSERT INTO buyer (name,email,password) VALUES (?,?,?)`;
    try {
        const [result,field] = await pool.query(insertQuery,[name,email,password]);
        return result;
    } catch (error) {
        console.log(error);
    }
    
   
   
    

}


async function findBuyer(email){
    const findQuery = ` SELECT  * FROM buyer WHERE email=? `;
    try {
        const [row,field] =  await pool.query(findQuery,[email]);
        return row[0];//this return only object no object inside array
    } catch (error) {
        console.log(error);
    }
   
}



module.exports={createBuyer,findBuyer};