const { error } = require("console");
const {pool} = require("../../connection");
const { wrapAwait } = require("../../errorHandling");

const buyerTableName = 'buyer';
const favouritePropertyTableName = 'favouriteProperty'
const schemaName = 'nres_users';




//-------------------------------------------Creating Table--------------------------------------------

async function createBuyer(name,email,password){

    
    
        const query  = `CREATE TABLE IF NOT EXISTS ${schemaName}.${buyerTableName} (
            
           id varchar(36) UNIQUE PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255),UNIQUE(email) ) `;
        try {
            const [row,field] = await pool.query(query)
            console.log("Table Created");
            console.log(row);
        } catch (error) {
            console.log(error);
        }
        
    

    //insert into table sql
    const insertQuery =  `INSERT INTO ${schemaName}.${buyerTableName}  (id,name,email,password) VALUES (uuid(),?,?,?)`;
    try {
        const [result,field] = await pool.query(insertQuery,[name,email,password]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
    
   
   
    

}

async function createFavouritePropertyTable(){

    const createQuery = `CREATE TABLE IF NOT EXISTS ${schemaName}.${favouritePropertyTableName}(
        property_ID INT NOT NULL  ,
        id varchar(36) NOT NULL ,
        FOREIGN KEY(property_ID) REFERENCES nres_property.Property(property_ID),
        FOREIGN KEY (id) REFERENCES ${schemaName}.${buyerTableName}(id),
        Constraint favouriteProperty PRIMARY KEY (property_ID , id)

    )`;

    try {
        const[result,field] = await pool.query(createQuery);
        console.log(result)
        return result;
    } catch (error) {
        console.log(error)
        throw error;

    }
    
}



// buyer fav property list table

async function insertIntofavProperty(buyer_ID,property_ID){

    await createFavouritePropertyTable();
    

    const insertQuery = `INSERT INTO  ${schemaName}.${favouritePropertyTableName} (property_ID,id) VALUES (?,?)`;

    try {
        const[result,field] = await pool.query(insertQuery,[property_ID,buyer_ID]);
        console.log(result)
        return result;

    } catch (error) {
        
        throw error;
    }

}



async function findBuyer(email){
    const findQuery = ` SELECT  * FROM ${schemaName}.${buyerTableName} } WHERE email=? `;
    try {
        const [row,field] =  await pool.query(findQuery,[email]);
        return row[0];//this return only object no object inside array
    } catch (error) {
        console.log(error);
    }
   
}



module.exports={createBuyer,findBuyer,insertIntofavProperty};