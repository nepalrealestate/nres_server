

const {pool}  = require("../connection");





async function isTableExists(tableName){


    try {
        const query = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_name = '${tableName}'`;
        const [row,field] = await pool.query(query);
        const count = row[0].count;
        if(count===1){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        //console.log(error);
        return false;
    }

}









module.exports = {isTableExists};