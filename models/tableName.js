require("dotenv").config();
const db_prefix = process.env.DB_PREFIX;
const node_env = process.env.NODE_ENV;

let userSchemaName =  node_env=='Production'?`${db_prefix}_nres_users`:'nres_users';
let propertySchemaName = node_env=='Production'?`${db_prefix}_nres_property`:'nres_property';
let pendingPropertySchemaName =  node_env=='Production'?`${db_prefix}_nres_pending_property`:'nres_pending_property';
let serviceSchemaName = node_env=='Production'?`${db_prefix}_nres_services`:'nres_services';
let chatSchemaName = node_env=='Production'?`${db_prefix}_nres_chat`:'nres_chat';


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

    agentRating : `${userSchemaName}.agentRating`,

    //Staff related table
    staffActivityLog : `${userSchemaName}.staff_activity_log`
    

}





const propertyTable = {

    property : `${propertySchemaName}.property`,
    property_location : `${propertySchemaName}.property_location`,
  
    house: `${propertySchemaName}.house`,
    land :`${propertySchemaName}.land`,
    apartment :`${propertySchemaName}.apartment`,
    property_id_tracker: `${propertySchemaName}.property_id_tracker`,



    pending_property :`${pendingPropertySchemaName}.pending_property` ,
    pending_property_location : `${pendingPropertySchemaName}.pending_property_location`,
   
    pending_house :`${pendingPropertySchemaName}.pending_house` ,
    pending_land : `${pendingPropertySchemaName}.pending_land`,
    pending_apartment: `${pendingPropertySchemaName}.pending_apartment`,



    houseAds : `${propertySchemaName}.house_ads`,
    apartmentAds : `${propertySchemaName}.apartment_ads`,
    landAds : `${propertySchemaName}.land_ads`,

    houseComment : `${propertySchemaName}.house_comment`,
    apartmentComment : `${propertySchemaName}.apartment_comment`,
    landComment : `${propertySchemaName}.land_comment`
}


const serviceTable = {
    service : `${serviceSchemaName}.service`,

    service_provider: `${serviceSchemaName}.service_provider`
}


const chatTable = {
    customer : `${chatSchemaName}.customer_chat`,
    customer_list: `${chatSchemaName}.customer_list`,

    agent : `${chatSchemaName}.agent_chat`,
    agent_list : `${chatSchemaName}.agent_list`,

    staff    : `${chatSchemaName}.staff_chat`,
    staff_list : `${chatSchemaName}.staff_list`,
    staff_group : `${chatSchemaName}.staff_group`,
    staff_group_chat : `${chatSchemaName}.staff_group_chat`
}



const views = {


    latest_property_dashboard : `${propertySchemaName}.latest_property_dashboard`

}



// property 


module.exports = {userTable,propertyTable,serviceTable,views,chatTable}