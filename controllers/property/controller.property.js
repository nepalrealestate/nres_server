const { getPropertyWithAds, getLatestProperty, getProperty, getPropertyPriorityLocation, getLatestPropertyPriorityLocation, insertPropertyFieldVisit } = require("../../models/services/property/service.property");
const { handleErrorResponse } = require("../controller.utils");




const handleGetPropertyWithAds = async function (req,res){

    let page, limit, offSet;

    // if page and limit not set then defualt is 1 and 20 .
    page = req.query.page || 1;

    limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
    // if page and limit present in query then delete it
    if (req.query.page) delete req.query.page;

    if (req.query.limit) delete req.query.limit;

    offSet = (page - 1) * limit;

    try {
      const data = await getPropertyWithAds(req.query, limit, offSet);
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



module.exports = {handleGetPropertyWithAds,handleGetProperty,handleGetPropertyPriorityLocation,handleInsertPropertyFieldVisitRequest}