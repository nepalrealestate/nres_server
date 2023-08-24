
const { updatePropertyViews } = require("../../models/property/model.property");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const path = "uploads/property/land/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");
const { checkProperties } = require("../requiredObjectProperties");
const {Utility, utility, propertyUtility} = require("../controller.utils");
const { insertPendingLand, getLand, getPendingLand, insertLandFeedback, getLandByID, getPendingLandByID, approveLand, updateLandAds, insertLandComment, getLandComment, updateLandViews, insertRequestedLand } = require("../../models/services/property/service.land");
//const utils = new Utility();
const utils = utility();
const property = propertyUtility("land");


const handleAddLand = async (req, res) => {
  
  upload(req, res, async function (err) {
   
    utils.handleMulterError(req,res,err,addLand,true);
  });
  
  async function addLand(){

   property.handleAddProperty( req,res,insertPendingLand);
  }
      
    
};

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
    land = await getPendingLandByID(property_id);
    if (land === undefined || land === null) {
      return res.status(400).json({ message: "No Land" });
    }
    
    await approveLand(staff_id, property_id);
    return res.status(200).json({ message: "approve successfully" });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "approved denied ! please try later" });
  }
};




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

  return utils.handleInsertPropertyComment(req,res,insertLandComment);

}

const handleGetLandComment = async (req,res)=>{

  return utils.handleGetPropertyComment(req,res,getLandComment)

}

const handleInsertRequestedLand = async (req,res)=>{
  const requiredFields = [
    'property_type', 'property_area', 'road_size', 'sewage', 'furnish', 
    'drinking_water', 'electricity', 'minPrice', 'maxPrice', 'description',
    'needed', 'province', 'zone', 'district', 'municipality', 'ward',
    'landmark', 'name', 'email', 'phone_number', 'address'
];

console.log(requiredFields)

for (const field of requiredFields) {
  
  if (!req.body.hasOwnProperty(field)) {
      return res.status(400).json({message:"missing field"})
  }
}

const requestedLand= req.body;

try {
  const response = await insertRequestedLand(requestedLand)
  return res.status(200).json({message:"Requested Land Inserted Successfully"})
} catch (error) {
  return res.status(500).json({message:"Internal Error"});
}


}


module.exports = {
  handleAddLand,
  handleGetLand,
  handleLandFeedback,
  handleGetLandByID,
  handleGetPendingLand,
  handleApproveLand,
  handleUpdateLandAds,
  handleInsertLandComment,
  handleGetLandComment,
  handleInsertRequestedLand
};
