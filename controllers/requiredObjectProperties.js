// required object properties to check object properties


const checkProperties = {
    // property object
  
    property: [
      "property_id",
      "property_type",
      "property_name",
      "listed_for",
      "price",
      "area_aana",
      "area_sq_ft",
      "facing_direction",
      "state",
      "district",
      "city",
      "ward_number",
      "tole_name",
    ],
  
    // land object
    land: ["property_id", "land_type", "soil", "road_access_ft"],
  
    // house object
  
    // aparment object  =
  
    isPropertiesPresent : function(checkObject,objectName){
          const requiredProperties = this[objectName];
  
        for (let i = 0; i < requiredProperties.length; i++) {
        const propertyName = requiredProperties[i];
        if (!(propertyName in checkObject)) {
          return false;
        }
      }
  
      return true;
      }
  
  
  };


  module.exports = {checkProperties};


