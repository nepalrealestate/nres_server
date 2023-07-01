require("dotenv").config();
const db_prefix = process.env.DB_PREFIX;
const node_env = process.env.NODE_ENV;

let userSchemaName =  node_env=='Production'?`${db_prefix}_nres_users`:'nres_users';
let propertySchemaName = node_env=='Production'?`${db_prefix}_nres_property`:'nres_property';
let pendingPropertySchemaName =  node_env=='Production'?`${db_prefix}_nres_pending_property`:'nres_pending_property';
let serviceSchemaName = node_env=='Production'?`${db_prefix}_nres_services`:'nres_services';


//table name 
// users 

const userTable = {
    agent : `${userSchemaName}.agent`,
    buyer: `${userSchemaName}.buyer`,
    seller : `${userSchemaName}.seller`,
    staff: `${userSchemaName}.staff`,
    superAdmin : `${userSchemaName}.superAdmin`,


    // user - releated table
    agentProperty : `${userSchemaName}.agent_property`,


    passwordResetToken : `${userSchemaName}.passwordResetToken`,

    agentRating : `${userSchemaName}.agentRating`

}





const propertyTable = {

    property : `${propertySchemaName}.property`,
    property_location : `${propertySchemaName}.property_location`,
    property_area     : `${propertySchemaName}.property_area`,
    house: `${propertySchemaName}.house`,
    land :`${propertySchemaName}.land`,
    apartment :`${propertySchemaName}.apartment`,
    ownership : `${propertySchemaName}.property_ownership`,



    pending_property :`${pendingPropertySchemaName}.pending_property` ,
    pending_property_location : `${pendingPropertySchemaName}.pending_property_location`,
    pending_property_area     : `${pendingPropertySchemaName}.pending_property_area`,
    pending_house :`${pendingPropertySchemaName}.pending_house` ,
    pending_land : `${pendingPropertySchemaName}.pending_land`,
    pending_apartment: `${pendingPropertySchemaName}.pending_apartment`,



}


const serviceTable = {
    service : `${serviceSchemaName}.service`,

    service_provider: `${serviceSchemaName}.service_provider`
}




const views = {

    fullApartmentView : `${propertySchemaName}.apartment_property`,
    fullHouseView     : `${propertySchemaName}.house_property`,
    fullLandView      : `${propertySchemaName}.land_property`,

    unapprovedApartmentView : `${pendingPropertySchemaName}.pending_apartment_property`,
    unapprovedHouseView    : `${pendingPropertySchemaName}.pending_house_property`,
    unapprovedLandView     : `${pendingPropertySchemaName}.pending_land_property`,

}



// property 


module.exports = {userTable,propertyTable,serviceTable,views}