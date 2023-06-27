
const {pool}  = require("../../connection");
const { serviceTable, propertyTable } = require("../tableName");



async function registerServiceProvider(providerData){

    const query = `INSERT INTO ${serviceTable.service_provider} (provider_id,name,phone_number,email,service_type,state,district,city,ward_number,profile_image,status) VALUES (1,?,?,?,?,?,?,?,?,?,'pending')`;

    //provider data is comming in Array ;

    try {
        const [row,field] = await pool.query(query,providerData);
    } catch (error) {
        throw error;
    }

}



async function getServiceProvider(condition,limit,offSet){

    let sqlQuery = `SELECT name,phone_number,service_type,profile_image FROM ${serviceTable.service_provider} WHERE 1=1 ` ;

    
  const params = [];
  //adding search conditon on query
  for (let key of Object.keys(condition)) {
    if (condition[key]) {
      // adding search conditon and  push value in params array;
      sqlQuery += ` AND ${key} = ?`;
      params.push(condition[key]);
    }
  }

  //after adding search condition query

  sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`;
  console.log(sqlQuery)

  try {
    const [result, field] = await pool.query(sqlQuery, params);

    return result;
  } catch (error) {
    throw error;
  }
}







module.exports = {registerServiceProvider,getServiceProvider}