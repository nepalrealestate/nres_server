const { getPropertyWithAds, getLatestProperty, getProperty, getPropertyPriorityLocation, getLatestPropertyPriorityLocation, insertPropertyFieldVisit, insertPropertyShootSchedule, getPropertyShootSchedule, insertPropertyShootScheduleComment, getPropertyShootScheduleComment } = require("../../models/services/property/service.property");
const { handleErrorResponse, handleLimitOffset } = require("../controller.utils");




const handleGetPropertyWithAds = async function (req,res){

    let page, limit, offSet;

    // if page and limit not set then defualt is 1 and 20 .
    page = req.query.page || 1;

    limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
    // if page and limit present in query then delete it
    if (req.query.page) delete req.query.page;

    if (req.query.limit) delete req.query.limit;

    offSet = (page - 1) * limit;

    let condition = {};
    
    if(req.query.property_type){
      condition.property_type = req.query.property_type
    }
    if(req.query.listed_for){
      condition.listed_for = req.query.listed_for;
    }
    if(req.query.location){
      condition.location = req.query.location;
    }


    console.log(condition)

    try {
      const data = await getPropertyWithAds(condition, limit, offSet);
      console.log(data);
      //update views of property
      //await updateViewsCount()
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Error " });
    }
  }

const handleGetProperty = async function(req,res){

  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  try {
    const data = await getProperty(req.query, limit, offSet);
    console.log(data);
    //update views of property
    //await updateViewsCount()
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error " });
  }

}

const handleGetPropertyPriorityLocation = async function (req,res){


  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  // get condition
  let district  = req.body?.district?req.body.district:null;
  let condition = req.query?req.query:null;
  let location = req.query?.location?req.query.location:null;
  let minPrice = req.query?.minPrice?req.query.minPrice:null;
  let maxPrice  = req.query?.maxPrice?req.query.maxPrice:null
  condition.district = district;
  condition.location = location;

  condition.priceRange = {}
  if(minPrice){
    condition.priceRange.minPrice = minPrice;
    delete condition.minPrice;
  }
  if(maxPrice){
    condition.priceRange.maxPrice = maxPrice;
    delete condition.maxPrice;
  }


  console.log(condition)
  

  try {
    const data = await getLatestPropertyPriorityLocation(condition, limit, offSet);
    console.log(data);
    //update views of property
    //await updateViewsCount()
    return res.status(200).json(data);
  } catch (error) {
    
    console.log(error);
    handleErrorResponse(res,error);
   // return res.status(500).json({ message: "Internal Error " });
  }

}



const handleInsertPropertyFieldVisitRequest = async function (req,res){

    const {customer_id,property_id,property_type,request_date}  = req.body;

    try {
      const data  = await insertPropertyFieldVisit({
        customer_id,
        property_id,
        property_type,
        request_date
      })
      console.log(data);
      return res.status(200).json({message:"created Property Field Visit Request "})
    } catch (error) {
      handleErrorResponse(res,error);
    }



}

const handleInsertPropertyShootSchedule = async function (req,res){
  const {property_type,listed_for,location,owner,contact,scheduled_date}  = req.body;

  try {
    const response = await insertPropertyShootSchedule({property_type,listed_for,location,owner,contact,scheduled_date});
    console.log(response);
    return res.status(200).json({message:"Insert Property Shoot Schedule"});
  } catch (error) {
    handleErrorResponse(res,error);
  }
}

const handleGetPropertyShootSchedule = async function(req,res){
  const [limit,offset] = handleLimitOffset(req);
  let condition = {};

  try {
    const response =await getPropertyShootSchedule(condition,limit,offset);

    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleInsertPropertyShootScheduleComment = async function(req,res){
  let admin_id = req.id;
  let shoot_schedule_id = req.params.shoot_schedule_id;
  let {comment}  = req.body;

  console.log(admin_id,shoot_schedule_id,comment);

  try {
    const response = await insertPropertyShootScheduleComment(shoot_schedule_id,admin_id,comment);
    return res.status(200).json({message:"Comment Insert Successfull"});
  } catch (error) {
    handleErrorResponse(res,error)
  }
}
const handleGetPropertyShootScheduleComment = async function(req,res){
  const [limit,offset] = handleLimitOffset(req);
  let shoot_schedule_id = req.params.shoot_schedule_id;
  if(!shoot_schedule_id){
    return res.status(400).json({message:"Please Select Shoot Schedule"});
  }
  try {
    const response = await getPropertyShootScheduleComment(shoot_schedule_id,limit,offset);
    console.log(response) // response in array
    if(response.length ===0 ){
      return res.status(400).json({message:"Bad Request"})
    }
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res,error)
  }
}





module.exports = {handleGetPropertyWithAds,
  handleGetProperty,
  handleGetPropertyPriorityLocation,
  handleInsertPropertyFieldVisitRequest,
  handleInsertPropertyShootSchedule,
  handleGetPropertyShootSchedule,
  handleInsertPropertyShootScheduleComment,
  handleGetPropertyShootScheduleComment
}