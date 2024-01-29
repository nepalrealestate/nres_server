
const { updatePropertyViews } = require("../../models/property/model.property");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const path = "uploads/property/land"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image",20);
const updateUpload = new UploadImage(path, maxImageSize).upload.single("image");
const multer = require("multer");
const {Utility, utility, propertyUtility, handleErrorResponse} = require("../controller.utils");
const { getLand, getPendingLand, insertLandFeedback, getLandByID, getPendingLandByID, approveLand, updateLandAds, insertLandComment, getLandComment, updateLandViews, insertRequestedLand, insertLand, getRequestedLand, updateLand, deleteLand, soldLand, getSoldLandByID, deletePendingLand, updateLandListingType, deleteLandImage, insertLandFavourite, deleteLandFavourite } = require("../../models/services/property/service.land");
//const utils = new Utility();
const utils = utility();
const property = propertyUtility("land");


const handleAddLand = async (req, res) => {
  
  upload(req, res, async function (err) {
   
    utils.handleMulterError(req,res,err,addLand,true);
  });
  
  async function addLand(){
    property.handleAddProperty(req,res,insertLand)
   //property.handleAddProperty( req,res,insertPendingLand);
  }
      
    
};

const handleUpdateLand = async (req,res)=>{

  updateUpload(req,res,async function (err){
    utils.handleMulterError(req,res,err,update,false);
  })

  async function update(){
    property.handleUpdateProperty(req,res,updateLand)
  }

}

const handleDeleteLand = async (req,res)=>{
  property.handleDeleteProperty(req,res,getLandByID,deleteLand)
}

const handleDeleteLandImage  =async (req,res)=>{
  property.handleDeletePropertyImage(req,res,deleteLandImage)
}


const handleGetLand = async (req, res) => {

  return property.handleGetProperty(req,res,getLand);

};

const handleGetPendingLand = async (req, res) => {

    return property.handleGetProperty(req,res,getPendingLand);
   

};

const handleLandFeedback = async (req, res) => {
  return property.handleInsertPropertyFeedback(req,res,insertLandFeedback)
};

const handleGetLandByID = async (req, res) => {
  return property.handleGetPropertyByID(req,res,getLandByID,updateLandViews)
};

const handleApproveLand = async (req, res) => {
  const { property_id } = req.params;
  console.log(property_id);
  const staff_id = req.id;

  let land;

  try {
    await approveLand(staff_id, property_id);
    return res.status(200).json({ message: "approve successfully" });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "approved denied ! please try later" });
  }
};

const handleUpdateLandListingType = async (req,res)=>{
  const {property_id} = req.params;
  const {listing_type} = req.body;
  if(!property_id || !listing_type){
    return res.status(400).json({message:"Bad Request"});
  }
  try {
    const response = await updateLandListingType(property_id,listing_type);
    return res.status(200).json({message:"Successfully Updated"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}




const handleUpdateLandAds = async (req,res)=>{

  const {property_id} = req.params;
  const {platform,ads_status} = req.body;

  ads_statusRequired = ['unplanned','posted','progress','planned'];
  platformRequired  =['twitter','tiktok','instagram','facebook','youtube']

  if(!ads_statusRequired.includes(ads_status)  || 
    !platformRequired.includes(platform)){
      return res.status(400).json({message:"Wrong Input"});
    }

  
  try {
    
    const response = await updateLandAds(platform,ads_status,property_id)
 
    if(response[0] === 0 ){
      return res.status(400).json({message:"No property to update "})
    }
    return res.status(200).json({message:"Successfully Update ads status"});



  } catch (error) {
    return res.status(500).json({message:"unable to update"});
  }



}


const handleInsertLandComment = async function (req,res){

  return property.handleInsertPropertyComment(req,res,insertLandComment);

}

const handleGetLandComment = async (req,res)=>{

  return property.handleGetPropertyComment(req,res,getLandComment)

}


const handleSoldLand = async (req,res)=>{
  const {property_id} = req.params;
  if(!property_id){
    return res.status(400).json({message:"Bad Request"});
  }
  try {
    const response = await soldLand(property_id)
    return res.status(200).json({message:"Successfully Sold "})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleGetSoldLandByID = async (req,res)=>{
  const {property_id} = req.params;
  if(!property_id){
    return res.status(400).json({message:"Bad Request"});
  }
  try {
    const response = await getSoldLandByID(property_id)
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleGetPendingLandByID = async (req,res)=>{
  const {property_id} = req.params;
  if(!property_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await getPendingLandByID(property_id);
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleDeletePendingLand = async (req,res)=>{
  const {property_id} = req.params;
  if(!property_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await deletePendingLand(property_id);
    return res.status(200).json({message:"Successfully Deleted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleInsertLandFavourite = async (req,res)=>{
  const {property_id} = req.params;
  const user_id = req.id;

  if(!property_id || !user_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await insertLandFavourite(property_id,user_id);
    return res.status(200).json({message:"Successfully Inserted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleDeleteLandFavourite = async (req,res)=>{
  const {property_id} = req.params;
  const user_id = req.id;

  if(!property_id || !user_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await deleteLandFavourite(property_id,user_id);
    return res.status(200).json({message:"Successfully Deleted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}


module.exports = {
  handleAddLand,
  handleUpdateLand,
  handleDeleteLand,
  handleGetLand,
  handleLandFeedback,
  handleGetLandByID,
  handleGetPendingLand,
  handleApproveLand,
  handleUpdateLandAds,
  handleInsertLandComment,
  handleGetLandComment,
  handleSoldLand,
  handleGetSoldLandByID,
  handleGetPendingLandByID,
  handleDeletePendingLand,
  handleUpdateLandListingType,
  handleDeleteLandImage,
  handleInsertLandFavourite,
  handleDeleteLandFavourite
};
