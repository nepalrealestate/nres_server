

const { wrapAwait } = require("../../errorHandling");
const {insertIntoRequestedProperty, getProperty, getLatestPropertyDashboard}  = require("../../models/property/model.property")

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

  let page, limit ,offSet;
  console.log(req.query)

  // if page and limit not set then defualt is 1 and 20 .
   page = req.query.page || 1;
   
   limit = (req.query.limit < 20 )? req.query.limit : 20 || 20;
   // if page and limit present in query then delete it 
   if(req.query.page)  delete  req.query.page;
   
   if(req.query.limit) delete req.query.limit;
     
  

   offSet = (page-1) * limit;


   // write code in wrapAeait function
  //  try {
  //     const result = await ;
  //     return res.status(200).json({result});
  //  } catch (error) {
  //     return res
  //  }

  const [data,error]   =  await wrapAwait(getProperty(req.query,limit,offSet));
 console.log(typeof data)
  console.log(data);

  if(data){
    return res.status(200).json({data});
  }
  console.log(error)
  return res.status(400).json({message:"No property"});



  //  try {
  //     const houseData = await getHouseProperty(req.query,limit,offSet);
  //     console.log(houseData)
   
  //     return res.status(200).json(houseData);
  //  } catch (error) {
  //     return res.status(500).json({message:error.sqlMessage});
  //  }


}



const handleGetLatestPropertyDashboard = async function (req,res){

  try {
    const data = await getLatestPropertyDashboard();
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({message:"unable to get data"})
  }

}


module.exports = {handleRequestProperty,hanldeGetProperty,handleGetLatestPropertyDashboard}