const { UploadImage } = require("../../middlewares/middleware.uploadFile");

const { updatePropertyViews } = require("../../models/property/model.property");

const path = "uploads/property/house/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");

const {Utility, propertyUtility, utility} = require("../controller.utils");
const { insertPendingHouse, getHouse, getPendingHouse, insertHouseFeedback, getHouseByID, getPendingHouseByID, approveHouse, updateHouseAds, insertHouseComment, getHouseComment, updateHouseViews, insertRequestedHouse, insertHouse, getRequestedHouse } = require("../../models/services/property/service.house");
//const utils = new Utility();
const utils  = utility();

const property = propertyUtility("house");


const handleAddHouse = async (req, res) => {
  
  upload(req, res, async function (err) {
    utils.handleMulterError(req,res,err,addHouse,true);
  });
  
  async function addHouse (){
    property.handleAddProperty(req,res,insertHouse);
   // property.handleAddProperty(req,res,insertPendingHouse);
  }
  


};

const handleGetHouse = async (req, res) => {
  
  property.handleGetProperty(req,res, getHouse)    
 
 
};

const handleGetPendingHouse = async (req, res) => {


  property.handleGetProperty(req,res,getPendingHouse);

};

const handleHouseFeedback = async (req, res) => {
  const { property_ID, feedback } = req.body;

  try {
    const result = await insertHouseFeedback(property_ID, feedback);
    return res.status(200).json({ message: "Feedback Submit" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleUpdateHouseViews = async (req, res) => {
  const { property_id } = req.params;
  console.log(req.params);
  let longitude ;
  let latitude  ;

  try {
    const result = await updateHouseViews(property_id,latitude,longitude); //update property views common function to update views in parent table property
    return res.status(200).json({ message: "Views update successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
};

const handleGetHouseByID = async (req, res) => {

  return property.handleGetPropertyByID(req,res,getHouseByID,updateHouseViews);
  
};

// approve apply house

const handleApproveHouse = async (req, res) => {
  const { property_id } = req.params;
  console.log(property_id);
  const staff_id = req.id;
  let house;
  try {
    house = await getPendingHouseByID(property_id);
    if (house === undefined || house === null) {
      return res.status(400).json({ message: "No House" });
    }
    await approveHouse(staff_id, property_id);
    return res.status(200).json({ message: "approve successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "approved denied ! please try later" });
  }
};



const handleUpdateHouseAds = async (req,res)=>{

  const {property_id} = req.params;
  const {platform,ads_status} = req.body;

  ads_statusRequired = ['unplanned','posted','progress','planned'];
  platformRequired  =['twitter','tiktok','instagram','facebook','youtube']

  if(!ads_statusRequired.includes(ads_status)  || 
    !platformRequired.includes(platform)){
      return res.status(400).json({message:"Wrong Input"});
    }
  
  try {
    
    const response = await updateHouseAds(platform,ads_status,property_id)
    console.log(response)
 
    if(response[0] === 0 ){
      return res.status(404).json({message:"No property to update "})
    }
    return res.status(200).json({message:"Successfully Update ads status"});



  } catch (error) {
    return res.status(500).json({message:"unable to update"});
  }



}


const handleInsertHouseComment = async (req,res)=>{


  return property.handleInsertPropertyComment(req,res,insertHouseComment)
   


}


const handleGetHouseComment = async (req,res)=>{

  return property.handleGetPropertyComment(req,res,getHouseComment)

}

const handleInsertRequestedHouse = async (req,res)=>{
  const requiredHouseFields = [
    'property_type', 'property_area', 'property_age', 'floor', 'bedrooms', 
    'kitchen', 'living_rooms', 'facing', 'road_size', 'minPrice', 'maxPrice', 
    'furnish', 'description', 'needed', 'province', 'zone', 'district', 
    'municipality', 'ward', 'landmark', 'name', 'email', 'phone_number', 'address'
];
  
  for(const field of requiredHouseFields){
    if(!req.body.hasOwnProperty(field)){
      return res.status(400).json({message:"missing field"})
    }
  }

  const requestedHouse = req.body;
  try {
    const response = await insertRequestedHouse(requestedHouse);
    return res.status(200).json({message:"Requested House Inserted Successfully"});
  } catch (error) {
    console.log(error.name);
    if(error.name === 'SequelizeUniqueConstraintError'){
      return res.status(400).json({message:error.errors})
    }
    return res.status(500).json({message:"Internal Error"})
    
  }
}

const handleGetRequestedHouse = async (req,res)=>{
  property.handleGetProperty(req,res,getRequestedHouse)
}




module.exports = {
  handleAddHouse,
  handleGetHouse,
  handleHouseFeedback,
  handleUpdateHouseViews,
  handleGetHouseByID,
  handleGetPendingHouse,
  handleApproveHouse,
  handleUpdateHouseAds,
  handleInsertHouseComment,
  handleGetHouseComment,
  handleInsertRequestedHouse,
  handleGetRequestedHouse
};
