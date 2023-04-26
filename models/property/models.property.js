
const {pool} = require("../../connection");
const { isTableExists } = require("../commonModels");

const propertyTableName = 'Property'
const houseTableName = 'House';
const landTableName = 'Land';
const apartmentTableName = 'Apartment';




//--------------Create Table------------------------------------

// Create Property Table

async function createPropertyTable(){

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${propertyTableName} 
    (
        property_ID INT NOT NULL PRIMARY KEY,
        property_type varchar(255) NOT NULL,
        listed_for varchar(255) NOT NULL,
        price FLOAT,
        area_aana FLOAT,
        area_sq_ft FLOAT,
        facing_direction varchar(255),
        state varchar(255),
        district varchar(255),
        city varchar(255),
        ward_number INT,
        tole_name varchar(255)
    
    )`;

    try {
        const[row,field] = await pool.query(sqlQuery);
        console.log("Table Created");
        console.log(row);
    } catch (error) {
        console.log(error);
    }

}



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

// Create Apartment Table

async function createApartmentTable (){

    // create property table before apartment table
    await createPropertyTable();

    const sqlQuery = `CREATE TABLE  IF NOT EXISTS ${apartmentTableName} 
    (
        property_ID INT,
        bhk INT,
        situated_floor INT,
        furnish_status BOOL,
        parking BOOL,
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

//-------------------------------Insert Data------------------------------------

async function insertProperty(property){

    const isTablePresent = await isTableExists(propertyTableName);


    const {property_ID,property_type,listed_for,price,area_aana,area_sq_ft,facing_direction,state,district,city,ward_number,tole_name} = property;

    const insertQuery = `INSERT INTO ${propertyTableName} VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

    try {
        const [result,field] = await pool.query(insertQuery,[property_ID,property_type,listed_for,price,area_aana,area_sq_ft,facing_direction,state,district,city,ward_number,tole_name])
        console.log(result);

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

async function insertApartmentProperty(property,apartmentProperty){

        // if table is not create then create table
        await createApartmentTable();

        // insert property object data in property
        await insertProperty(property);

       

        const {property_ID,bhk,situated_floor,furnish_status,parking,facilities} = apartmentProperty;

        const insertQuery = `INSERT INTO ${apartmentTableName} VALUES (?,?,?,?)`;

        try {
            
            const [result,field] = await pool.query(insertQuery,[property_ID,bhk,situated_floor,furnish_status,parking,facilities]);
            console.log(result);

        } catch (error) {
            
            console.log(error);

        }


}



module.exports = {insertHouseProperty,insertLandProperty,insertApartmentProperty}
