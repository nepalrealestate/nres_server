
const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");

const propertyTableName = 'property';
const schemaName = 'nres_property';
const videoTableName = 'videoLink'



//--------------Create Table------------------------------------

// Create Property Table

async function createPropertyTable(){

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${propertyTableName} 
    (
        property_ID INT NOT NULL PRIMARY KEY,
        property_type varchar(255) NOT NULL,
        listed_for varchar(255) NOT NULL,
        status varchar(255),
        price FLOAT,
        area_aana FLOAT,
        area_sq_ft FLOAT,
        facing_direction varchar(255),
        views INT DEFAULT 0,
        state varchar(255),
        district varchar(255),
        city varchar(255),
        ward_number INT,
        tole_name varchar(255)
    
    )`;

    try {
        const[row,field] = await pool.query(sqlQuery);
        console.log(" Property Table Created");
        console.log(row);
    } catch (error) {
        console.log(error);
        throw error;
    }

}


// create table for store youtube vide link
async function createVideoLinkTable(){

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${videoTableName} (

        video_ID varchar(255) NOT NULL UNIQUE,
        property_type varchar(255) NOT NULL,
        video nvarchar(4000) NOT NULL ,
        PRIMARY KEY(video_ID)


    )`;
    try {
        const [row,field] = await pool.query(sqlQuery);
        console.log("video Link Table created");
        return row;
    } catch (error) {
        throw error;
    }

}






//-------------------------------Insert Data------------------------------------

//insert value in property table 
async function insertProperty(property){

    
    

    const {property_ID,property_name,property_type,listed_for,price,area_aana,area_sq_ft,facing_direction,state,district,city,ward_number,tole_name} = property;
    const views = 0;
    const status  = "On Sale";

    const insertQuery = `INSERT INTO ${schemaName}.${propertyTableName}  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    

    try {
        const [result,field] = await pool.query(insertQuery,[property_ID,property_type,property_name,listed_for,status,price,area_aana,area_sq_ft,facing_direction,views,state,district,city,ward_number,tole_name])
        console.log(result);

    } catch (error) {
        
        throw error;
    }

}

async function updatePropertyViews(property_ID){

    // update views by vaule   1

    const updateQuery = `UPDATE ${schemaName}.${propertyTableName} SET views=views+1 WHERE property_ID='${property_ID}'`;

    try {
        const [result,field] = await pool.query(updateQuery);

    } catch (error) {
        throw error;
    }

}


// insert video link

async function insertVideoLink(video_ID,property_type,videoLink){

    await createVideoLinkTable();

    const insertQuery  = `INSERT INTO ${schemaName}.${videoTableName} VALUES (?,?,?)`;

    try {
        await pool.query(insertQuery,[video_ID,property_type,videoLink]);
        
    } catch (error) {
        throw error;
    }

}












module.exports = {createPropertyTable,insertProperty,updatePropertyViews,createVideoLinkTable,insertVideoLink}
