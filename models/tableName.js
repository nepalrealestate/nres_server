require("dotenv").config();
const db_prefix = process.env.DB_PREFIX;
const node_env = process.env.NODE_ENV;

let userSchemaName =  node_env=='Production'?`${db_prefix}_nres_users`:'nres_users';
let propertySchemaName = node_env=='Production'?`${db_prefix}_nres_property`:'nres_property';
let unapprovedPropertySchemaName =  node_env=='Production'?`${db_prefix}_nres_unapproved_property`:'nres_unapproved_property';
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



    unapproved_property :`${unapprovedPropertySchemaName}.unapproved_property` ,
    unapproved_property_location : `${unapprovedPropertySchemaName}.unapproved_property_location`,
    unapproved_property_area     : `${unapprovedPropertySchemaName}.unapproved_property_area`,
    unapproved_house :`${unapprovedPropertySchemaName}.unapproved_house` ,
    unapproved_land : `${unapprovedPropertySchemaName}.unapproved_land`,
    unapproved_apartment: `${unapprovedPropertySchemaName}.unapproved_apartment`,



}


const serviceTable = {
    service : `${serviceSchemaName}.service`,

    service_provider: `${serviceSchemaName}.service_provider`
}




const views = {

    fullApartmentView : `${propertySchemaName}.apartment_property`,
    fullHouseView     : `${propertySchemaName}.house_property`,
    fullLandView      : `${propertySchemaName}.land_property`,

    unapprovedApartmentView : `${unapprovedPropertySchemaName}.unapproved_apartment_property`,
    unapprovedHouseView    : `${unapprovedPropertySchemaName}.unapproved_house_property`,
    unapprovedLandView     : `${unapprovedPropertySchemaName}.unapproved_land_property`,

}



// property 


module.exports = {userTable,propertyTable,serviceTable,views}