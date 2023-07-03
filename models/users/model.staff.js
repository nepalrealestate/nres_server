const {pool}  = require("../../connection");
const {isTableExists} = require("../commonModels");
const { propertyTable, userTable } = require("../tableName");

const staffTableName = 'staff';
const schemaName = 'nres_users';

async function registerStaff(name,email,password){


    

    
    
   

       

        try {
            const [row,field] = await pool.query(query)
            console.log("Table Created");
            console.log(row);
        } catch (error) {
            console.log("Console Error from try catch",error);
        }
        const insertQuery =  `INSERT INTO ${userTable.staff} (id,name,email,password) VALUES (0,?,?,?)`;
        try {
            const [result,field] = await pool.query(insertQuery,[name,email,password]);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

  

async function findStaff(email){
    const findQuery = ` SELECT  * FROM ${userTable.staff} WHERE email=? `;
    try {
        const [row,field] =  await pool.query(findQuery,[email]);
        return row[0];//this return only object no object inside array
    } catch (error) {
        console.log(error);
    }
}

async function getStaffByID(id){
    const getQuery = `SELECT id,name,email FROM ${userTable.staff} WHERE id = ?`;


    try {
        const[result,field] = await pool.query(getQuery,[id]);
        console.log(result[0])
        return result[0];
    } catch (error) {
        throw error;
    }
}



module.exports = {registerStaff,findStaff,getStaffByID}
