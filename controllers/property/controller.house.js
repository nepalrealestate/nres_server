const { UploadImage } = require("../../middlewares/middleware.uploadFile");

const { updatePropertyViews } = require("../../models/property/model.property");

const path = "uploads/property/house/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");

const {Utility, propertyUtility, utility} = require("../controller.utils");
const { insertPendingHouse, getHouse, getPendingHouse, insertHouseFeedback, getHouseByID, getPendingHouseByID, approveHouse, updateHouseAds, insertHouseComment, getHouseComment, updateHouseViews } = require("../../models/services/property/service.house");
//const utils = new Utility();
const utils  = utility();

const property = propertyUtility("house");


const handleAddHouse = async (req, res) => {
  
  upload(req, res, async function (err) {
    utils.handleMulterError(req,res,err,addHouse,true);
  });
  
  async function addHouse (){
    property.handleAddProperty(req,res,insertPendingHouse);
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
  const {ads_status} = req.body;

  
  try {
    
    const response = await updateHouseAds(ads_status,property_id)
 
    if(response.affectedRows === 0 ){
      return res.status(400).json({message:"No property to update "})
    }
    return res.status(200).json({message:"Successfully Update ads status"});



  } catch (error) {
    return res.status(500).json({message:"unable to update"});
  }



}


const handleInsertHouseComment = async (req,res)=>{

  
  return utils.handleInsertPropertyComment(req,res,insertHouseComment)
   


}


const handleGetHouseComment = async (req,res)=>{

  return utils.handleGetPropertyComment(req,res,getHouseComment)

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
  handleGetHouseComment
};
