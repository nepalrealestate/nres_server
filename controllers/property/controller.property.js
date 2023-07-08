

const { wrapAwait } = require("../../errorHandling");
const {insertIntoRequestedProperty, getProperty, getLatestPropertyDashboard}  = require("../../models/property/model.property");
const { Utility } = require("../controller.utils");


const utils = new Utility();

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


const hanldeGetProperty = async (req,res)=>{


  return utils.getSearchData(req,res,getProperty)
  
}



const handleGetLatestPropertyDashboard = async function (req,res){

  return utils.getSearchData(req,res,getLatestPropertyDashboard);

}


module.exports = {handleRequestProperty,hanldeGetProperty,handleGetLatestPropertyDashboard}