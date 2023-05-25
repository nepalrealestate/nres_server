

const userSchemaName = 'nres_users';
const propertySchemaName = 'nres_property';


//table name 
// users 

const userTable = {
    agent : `${userSchemaName}.agent`,
    buyer: `${userSchemaName}.buyer`,
    seller : `${userSchemaName}.seller`,
    staff: `${userSchemaName}.staff`,
    superAdmin : `${userSchemaName}.superAdmin`,


    // user - releated table
    agentProperty : `${userSchemaName}.agent_property`

}





const propertyTable = {

    property : `${propertySchemaName}.property`,
    house: `${propertySchemaName}.house`,
    land :`${propertySchemaName}.land`,
    apartment :`${propertySchemaName}.apartment`,
    ownership : `${propertySchemaName}.property_ownership`,




}

const views = {

    fullApartmentView : `${propertySchemaName}.full_apartment_property`,
    fullHouseView     : `${propertySchemaName}.full_house_property`,
    fullLandView      : `${propertySchemaName}.full_land_property`
    

}



// property 


module.exports = {userTable,propertyTable,views}