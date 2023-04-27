const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty} = require("../property/models.property");
const propertyTableName = 'Property'
const houseTableName = 'House';


// Create House Table

async function createHouseTable(){
    //if not exists then create property table
    await createPropertyTable();
    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${houseTableName} 
    (
        property_ID INT NOT NULL PRIMARY KEY UNIQUE,
        room INT,
        floor FLOAT,
        furnish_status BOOL,
        parking BOOL,
        road_access_ft FLOAT,
        facilities VARCHAR(1000),
        FOREIGN KEY (property_ID) references Property(property_ID)
    
    )`;

    try {
        const[row,field] = await pool.query(sqlQuery);
        console.log("Table Created");
        console.log(row);
    } catch (error) {
        console.log(error);
    }

}



async function insertHouseProperty(property,houseProperty){

    console.log(property,houseProperty)

   await createHouseTable();

   //two different object recieve for store data 
   await insertProperty(property);

   

   const { property_ID,room,floor,furnish_status,parking,road_access_ft,facilities } = houseProperty;

   const insertQuery = `INSERT INTO ${houseTableName} VALUES (?,?,?,?,?,?,?)`;

   try {
       const [result,field] = await pool.query(insertQuery,[property_ID,room,floor,furnish_status,parking,road_access_ft,facilities])
       console.log(result);
   } catch (error) {

       console.log(error);
       
   }


}


async function getHouseProperty(condition,limit,offSet){


    let sqlQuery = `SELECT p.*,h.* FROM ${propertyTableName} AS p INNER JOIN ${houseTableName} AS h ON p.property_ID=h.property_ID WHERE 1=1 `;

    const params = [];
    //adding search conditon on query
    for(let key of Object.keys(condition)){

       

        if(condition[key]){
            // adding search conditon and  push value in params array;
            sqlQuery += `AND ${key} = ?`
            params.push(condition[key]);
        }

    }

    //after adding search condition query

    sqlQuery += `LIMIT ${limit} OFFSET ${offSet}`

    console.log(sqlQuery);
    

    try {
        const [result,field] = await pool.query(sqlQuery,params);
      
        return result;
    } catch (error) {
        console.log(error);
    }



}




module.exports = {insertHouseProperty,getHouseProperty}


