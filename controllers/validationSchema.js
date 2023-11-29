const Joi = require("joi")
const apartmentSchema  = Joi.object({
  property_type: Joi.string().valid('apartment').default('apartment'),
  property_for: Joi.string().valid('commercial', 'residential', 'office').required(),
  property_name: Joi.string().required().not('').label('Property name cannot be empty'),
  listed_for: Joi.string().valid('sale', 'rent').required(),
  property_age: Joi.number().integer().optional(),
  floor: Joi.number().precision(2).optional(),
  bhk: Joi.number().integer().optional(),
  facing: Joi.string().valid('east', 'west', 'north', 'south', 'north-east','south-east','north-west','south-west').required(),
  province: Joi.string().optional(),
  district: Joi.string().optional(),
  municipality: Joi.string().optional(),
  area_name: Joi.string().optional(),
  ward: Joi.number().integer().optional(),
  landmark: Joi.string().optional(),
  latitude: Joi.number().precision(6).optional(),
  longitude: Joi.number().precision(6).optional(),
  property_area: Joi.string().optional(),
  road_size: Joi.number().precision(2).optional(),
  price: Joi.number().precision(2).required(),
  price_type: Joi.string().valid('fixed', 'negotiable').required(),
  furnish: Joi.string().valid('non-furnished', 'furnished', 'semi-furnished').required(),
  parking_bike: Joi.number().integer().optional(),
  parking_car: Joi.number().integer().optional(),
  amenities: Joi.object().optional(), 
  description: Joi.string().optional().allow(''),
  social_media: Joi.object().optional()
})

const houseSchema = Joi.object({
  property_type: Joi.string().valid('house').default('house'),
  property_for: Joi.string().valid('commercial', 'residential', 'office').required(),
  property_name: Joi.string().required().not('').label('Property name cannot be empty'),
  listed_for: Joi.string().valid('sale', 'rent').required(),
  property_age: Joi.number().integer().optional(),
  floor: Joi.number().precision(2).optional(),
  bedrooms: Joi.number().integer().optional(),
  kitchen: Joi.number().integer().optional(),
  bathrooms_attached: Joi.number().integer().optional(),
  bathrooms_common: Joi.number().integer().optional(),
  facing: Joi.string().valid('east', 'west', 'north', 'south', 'north-east', 'south-east', 'north-west', 'south-west').required(),
  province: Joi.string().optional(),
  district: Joi.string().optional(),
  municipality: Joi.string().optional(),
  area_name: Joi.string().optional(),
  ward: Joi.number().integer().optional(),
  landmark: Joi.string().optional(),
  latitude: Joi.number().precision(6).optional(),
  longitude: Joi.number().precision(6).optional(),
  property_area: Joi.string().optional(),
  road_size: Joi.number().precision(2).optional(),
  price: Joi.number().precision(2).required(),
  price_type: Joi.string().valid('fixed', 'negotiable').required(),
  furnish: Joi.string().valid('non-furnished', 'furnished', 'semi-furnished').required(),
  parking_bike: Joi.number().integer().optional(),
  parking_car: Joi.number().integer().optional(),
  amenities: Joi.object().optional(), // Depending on your JSON structure, you may need to provide more specific validation
  description: Joi.string().optional().allow(''),
  social_media: Joi.object().optional()
})


const landSchema = Joi.object({
  property_type: Joi.string().valid('land').default('land'),
  property_for: Joi.string().valid('non-plotted', 'plotted').required(),
  property_name: Joi.string().required().not('').label('Property name cannot be empty'),
  listed_for: Joi.string().valid('sale', 'rent').required(),
  twist: Joi.number().precision(2).optional(),
  property_area: Joi.string().optional(),
  road_size: Joi.number().precision(2).optional(),
  facing: Joi.string().valid('east', 'west', 'north', 'south', 'north-east', 'south-east', 'north-west', 'south-west').required(),
  province: Joi.string().optional(),
  district: Joi.string().optional(),
  municipality: Joi.string().optional(),
  area_name: Joi.string().optional(),
  ward: Joi.number().integer().optional(),
  landmark: Joi.string().optional(),
  latitude: Joi.number().precision(6).optional(),
  longitude: Joi.number().precision(6).optional(),
  price: Joi.number().precision(2).required(),
  price_type: Joi.string().valid('fixed', 'negotiable').required(),
  amenities: Joi.object().optional(), // Depending on your JSON structure, you may need to provide more specific validation
  description: Joi.string().optional().allow(''),
  social_media: Joi.object().optional() // Depending on your JSON structure, you may need to provide more specific validation

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
