const { UploadImage } = require("../../middlewares/middleware.uploadFile");

const {
  updatePropertyViews,
} = require("../../models/property/model.property");

const path = "uploads/property/apartment"; //path from source
const maxImageSize = 2 * 1024 * 1024;

const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const updateUpload = new UploadImage(path, maxImageSize).upload.single("image");
const multer = require("multer");
const {Utility, propertyUtility, utility, handleErrorResponse} = require("../controller.utils");
const { getPendingApartment, approveApartment, getPendingApartmentByID, getApartment, getApartmentByID, updateApartmentViews, insertRequestedApartment, updateApartmentAds, insertApartment, getRequestedApartment, updateApartment, deleteApartment, insertApartmentComment, getApartmentComment, soldApartment, getSoldApartmentByID, deletePendingApartment, updateApartmentListingType, deleteApartmentImage, insertApartmentFavourite, deleteApartmentFavourite } = require("../../models/services/property/service.apartment");
const { wrapAwait } = require("../../errorHandling");
const { apartmentSchema } = require("../validationSchema");
const { findCustomer } = require("../../models/services/users/service.customer");
//const utils = new Utility();
const utils = utility();
const property = propertyUtility("apartment");


// ------------------------------------------INSERT DATA RELATED ---------------------------------

const handleAddApartment = async (req, res) => {

    upload(req, res, async function (err) {
      utils.handleMulterError(req,res,err,addApartment,true);
    });
  
    
    async function addApartment (){
      //property.handleAddProperty(req, res, insertPendingApartment);
      property.handleAddProperty(req,res,insertApartment);
    }
    
};



const handleUpdateApartment = async (req,res)=>{

  updateUpload(req,res,async function (err){
    utils.handleMulterError(req,res,err,update,false);
  })

  async function update(){
    property.handleUpdateProperty(req,res,updateApartment)
  }

}

const handleDeleteApartment = async (req,res)=>{

  

  property.handleDeleteProperty(req,res,getApartmentByID,deleteApartment);
}

const handleDeleteApartmentImage = async (req,res)=>{
  property.handleDeletePropertyImage(req,res,deleteApartmentImage)
}




const handleApartmentFeedback = async (req, res) => {
  const { property_ID, feedback } = req.body;

  try {
    const result = await insertApartmentFeedback(property_ID, feedback);
    
    return res.status(200).json({ message: "Feedback Submit" });
  } catch (error) {
   return handleErrorResponse(res,error)
  }
};

// ---------------------------------------------------------GET DATA RELATED-------------------------------------------------------

const handleGetApartment = async (req, res) => {


  return property.handleGetProperty(req,res,getApartment);

  
};

const handleGetPendingApartment = async (req, res) => {
 

 
    return property.handleGetProperty(req,res,getPendingApartment)

};

const handleGetApartmentByID = async (req, res) => {

  return property.handleGetPropertyByID(req,res,getApartmentByID,updateApartmentViews);
  
};

//-----------------------------------------------UPDATE RELATED-------------------------------------------------------------


const handleApproveApartment = async (req, res) => {
  // handle approved apartment and shift unapproved apartmnet to approved apartment table

  const { property_id } = req.params;
  if(!property_id){
    return res.status(400).json({message:"Bad Request"})
  }

  console.log(property_id);
  const staff_id = req.id;
  try {
    const response  = await approveApartment(staff_id, property_id);
    return res.status(200).json({ message: "approve successfully" });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "approved denied ! please try later" });
  }
};


const handleUpdateApartmentListingType = async (req,res)=>{
  const {property_id} = req.params;
  const {listing_type} = req.body;

  if(!property_id || !listing_type){
    return res.status(400).json({message:"Bad Request"})
  }

  try {
    const response = await updateApartmentListingType(property_id,listing_type);
    return res.status(200).json({message:"Successfully Updated"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}



const handleUpdateApartmentAds = async (req,res)=>{

  const {property_id} = req.params;
  const {platform,ads_status} = req.body;

  ads_statusRequired = ['unplanned','posted','progress','planned'];
  platformRequired  =['twitter','tiktok','instagram','facebook','youtube']

  if(!ads_statusRequired.includes(ads_status)  || 
    !platformRequired.includes(platform)){
      return res.status(400).json({message:"Bad Request"});
    }

  
  try {
    
    const response = await updateApartmentAds(platform,ads_status,property_id)
 
    if(response[0] === 0  ){
      return res.status(400).json({message:"No property to update "})
    }
    return res.status(200).json({message:"Successfully Update ads status"});



  } catch (error) {
    return res.status(500).json({message:"unable to update"});
  }



}


const handleInsertApartmentComment = async function (req,res){

    return property.handleInsertPropertyComment(req,res,insertApartmentComment);

}

const handleGetApartmentComment = async (req,res)=>{

  return property.handleGetPropertyComment(req,res,getApartmentComment)

}





const handleSoldApartment = async (req,res)=>{
  const {property_id} = req.params;

  if(!property_id){
    return res.status(400).json({message:"Bad Request"})
  }

  try {
    const response = await soldApartment(property_id);
    console.log("Response from sold",response)
    return res.status(200).json({message:"Successfully Sold"});
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleGetSoldApartmentByID = async (req,res)=>{
  const {property_id} = req.params;
  if(!property_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await getSoldApartmentByID(property_id)
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleGetPendingApartmentByID =async (req,res)=>{
  const {property_id} = req.params;

  if(!property_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await getPendingApartmentByID(property_id);
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleDeletePendingApartment = async (req,res)=>{
  const {property_id} = req.params;
  if(!property_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await deletePendingApartment(property_id);
    return res.status(200).json({message:"Successfully Deleted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleInsertApartmentFavourite = async (req,res)=>{
  const {property_id} = req.params;
  const user_id = req.id;

  if(!property_id || !user_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await insertApartmentFavourite(property_id,user_id);
    return res.status(200).json({message:"Successfully Inserted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}



const handleDeleteApartmentFavourite = async (req,res)=>{
  const {property_id} = req.params;
  const user_id = req.id;

  if(!property_id || !user_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await deleteApartmentFavourite(property_id,user_id);
    return res.status(200).json({message:"Successfully Deleted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

module.exports = {
  handleAddApartment,
  handleUpdateApartment,
  handleDeleteApartment,
  handleDeleteApartmentImage,
  handleGetApartment,
  handleApartmentFeedback,
  handleGetApartmentByID,
  handleGetPendingApartment,
  handleApproveApartment,
  handleUpdateApartmentAds,
  handleInsertApartmentComment,
  handleGetApartmentComment,
  handleSoldApartment,
  handleGetSoldApartmentByID,
  handleGetPendingApartmentByID,
  handleDeletePendingApartment,
  handleUpdateApartmentListingType,
  handleInsertApartmentFavourite,
  handleDeleteApartmentFavourite
};
