

const userSchemaName = 'nres_users';
const propertySchemaName = 'nres_property';
const unapprovedPropertySchemaName = 'nres_unapproved_property';

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



    unapproved_property :`${unapprovedPropertySchemaName}.unapproved_property` ,
    unapproved_house :`${unapprovedPropertySchemaName}.unapproved_house` ,
    unapproved_land : `${unapprovedPropertySchemaName}.unapproved_land`,
    unapproved_apartment: `${unapprovedPropertySchemaName}.unapproved_apartment`,
    unapproved_property_location: `${unapprovedPropertySchemaName}.unapproved_property_location`,
    unapproved_property_area: `${unapprovedPropertySchemaName}.unapproved_property_area`


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


module.exports = {userTable,propertyTable,views}