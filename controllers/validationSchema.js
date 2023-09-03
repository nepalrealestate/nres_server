const Joi = require("joi")
const apartmentSchema  = Joi.object({
    property_type: Joi.string().valid('apartment'),
    property_for: Joi.string().valid('commercial', 'residential', 'office'),
    property_name: Joi.string(),
    listed_for: Joi.string().valid('sell', 'rent'),
    property_age: Joi.number().integer(),
    floor: Joi.number(),
    bhk: Joi.number().integer(),
    facing: Joi.string().valid('east', 'west', 'north', 'south', 'east-north', 'east-south', 'west-north', 'west-south'),
    province: Joi.string(),
    district: Joi.string(),
    municipality: Joi.string(),
    ward: Joi.number().integer(),
    landmark: Joi.string(),
    latitude: Joi.number().precision(6),
    longitude: Joi.number().precision(6),
    property_area: Joi.number(),
    road_size: Joi.number(),
    price: Joi.number().precision(2),
    price_type: Joi.string().valid('fixed', 'negotiable'),
    furnish: Joi.string().valid('non-furnished', 'furnished', 'semi-furnished'),
    parking_bike: Joi.number().integer(),
    parking_car: Joi.number().integer(),
    amenities: Joi.object(), 
    description: Joi.string(),
    social_media: Joi.object() 
})

const houseSchema = Joi.object({
  property_type: Joi.string().valid('house').default('house'),
    property_for: Joi.string().valid('commercial', 'residential', 'office'),
    property_name: Joi.string().required().not().empty(),
    listed_for: Joi.string().valid('sell', 'rent'),
    property_age: Joi.number().integer(),
    floor: Joi.number(),
    bedrooms: Joi.number().integer(),
    kitchen: Joi.number().integer(),
    bathrooms_attached: Joi.number().integer(),
    bathrooms_common: Joi.number().integer(),
    facing: Joi.string().valid('east', 'west', 'north', 'south', 'east-north', 'east-south', 'west-north', 'west-south'),
    province: Joi.string(),
    district: Joi.string(),
    municipality: Joi.string(),
    ward: Joi.number().integer(),
    landmark: Joi.string(),
    latitude: Joi.number().precision(6),
    longitude: Joi.number().precision(6),
    property_area: Joi.number(),
    road_size: Joi.number(),
    price: Joi.number().precision(2).required(),
    price_type: Joi.string().valid('fixed', 'negotiable'),
    furnish: Joi.string().valid('non-furnished', 'furnished', 'semi-furnished'),
    parking_bike: Joi.number().integer(),
    parking_car: Joi.number().integer(),
    amenities: Joi.object(), // This could be more specific depending on your JSON structure
    description: Joi.string(),
    social_media: Joi.object()
})


const landSchema = Joi.object({
  property_type: Joi.string().valid('land').default('land'),
    property_for: Joi.string().valid('non-plotted', 'plotted'),
    property_name: Joi.string().required().min(1),
    listed_for: Joi.string().valid('sell', 'rent'),
    property_age: Joi.number().integer(),
    facing: Joi.string().valid('east', 'west', 'north', 'south', 'east-north', 'east-south', 'west-north', 'west-south'),
    province: Joi.string(),
    district: Joi.string(),
    municipality: Joi.string(),
    ward: Joi.number().integer(),
    landmark: Joi.string(),
    latitude: Joi.number().precision(6),
    longitude: Joi.number().precision(6),
    property_area: Joi.number(),
    road_size: Joi.number(),
    price: Joi.number().precision(2).required(),
    price_type: Joi.string().valid('fixed', 'negotiable'),
    amenities: Joi.object(), // For more detailed validation, you would need to know the structure of this JSON
    description: Joi.string(),
    social_media: Joi.object() // Similarly, for more detailed validation, you would need the structure
})

// async function errorTypeResonse(callback){

//     try{
//         const value = await callback();
//         return value;
//     }catch(error){
//         throw error.name = "schemaValidationError";
//     }

// }===

// async function validationSchemaError (callback,property){
//     try {
//         return await callback(property);
//     } catch (error) {
//        // error.name = "validateSchemaError"
//         throw error
//     }
// }

const validateSchema={
    "apartment":async (property)=>await apartmentSchema.validateAsync(property),
    "house":async(property)=>await houseSchema.validateAsync(property),
    "land":async(property)=>await landSchema.validateAsync(property)
  }

module.exports = {validateSchema}
