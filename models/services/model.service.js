
const {pool}  = require("../../connection");
const { serviceTable } = require("../tableName");



async function registerServiceProvider(providerData){

    const query = `INSERT INTO ${serviceTable.service_provider} (provider_id,name,phone_number,email,service_type,state,district,city,ward_number,profile_image,status) VALUES (1,?,?,?,?,?,?,?,?,?,'pending')`;

    //provider data is comming in Array ;

    try {
        const [row,field] = await pool.query(query,providerData);
    } catch (error) {
        throw error;
    }

}


module.exports = {registerServiceProvider}