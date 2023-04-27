const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");
const {createPropertyTable,insertProperty} = require("../property/models.property");
const propertyTableName = 'Property'
const houseTableName = 'House';
const landTableName = 'Land';
const apartmentTableName = 'Apartment';




// Create Land Table

async function createLandTable(){
    // create property table before apartment table
    await createPropertyTable();
  const sqlQuery = `CREATE TABLE  IF NOT EXISTS ${landTableName} 
  (
      property_ID INT,
      land_type VARCHAR(255),
      soil VARCHAR(255),
      road_access_ft FLOAT,
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


async function insertLandProperty(property,houseProperty){

    // if table is not create then create table
    await createLandTable();

    // insert property object data in property
    await insertProperty(property);


    const {property_ID,land_type,soil,road_access_ft} = houseProperty;

    const insertQuery = `INSERT INTO ${landTableName} VALUES (?,?,?,?)`;

    try {
        const [result,field] = await pool.query(insertQuery,[property_ID,land_type,soil,road_access_ft])
        console.log(result);
    } catch (error) {
        console.log(error);
    }


}



async function getLandProperty(condition,limit,offSet){


    let sqlQuery = `SELECT p.*,l.* FROM ${propertyTableName} AS p INNER JOIN ${landTableName} AS l ON p.property_ID=l.property_ID WHERE 1=1 `;

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




module.exports = {insertLandProperty,getLandProperty};