
const {insertIntoRequestedProperty}  = require("../../models/property/model.property")

const handleRequestProperty = async (req,res)=>{

//const property = req.body;
 
  // if any property field missing then assign to null to avoid db error;
   const {name,email,phone_number,requested_for,property_type,urgency,price_range,description,province,district,municipality,ward_number} = {...req.body};

   const property = {name,email,phone_number,requested_for,property_type,urgency,price_range,description,province,district,municipality,ward_number}

 
  
  try {
    await insertIntoRequestedProperty(property);
    return res.status(200).json({message:"request property successfull"});
  } catch (error) {
    return res.status(400).json({message:error});
    
  }
 




} 

module.exports = {handleRequestProperty}