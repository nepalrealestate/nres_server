const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const {

  getHouseProperty,
  insertHouseFeedback,
  getHouseByID,
  approveHouse,
  getPendingHouseProperty,
  getUnapprovedHouseByID,
  insertPendingHouseProperty,
  getPendingHouseByID,
} = require("../../models/property/model.house");
const { updatePropertyViews } = require("../../models/property/model.property");

const path = "uploads/property/house/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");

const {Utility} = require("../controller.utils");
const utils = new Utility();



const handleAddHouse = async (req, res) => {
  
  upload(req, res, async function (err) {
    utils.handleMulterError(req,res,err,addHouse,true);
  });
  
  async function addHouse (){
    utils.handleAddProperty(req,res,insertPendingHouseProperty);
  }
  


};

const handleGetHouse = async (req, res) => {
  
  utils.getSearchData(req,res, getHouseProperty)    
 
 
};

const handleGetPendingHouse = async (req, res) => {


  utils.getSearchData(req,res,getPendingHouseProperty);

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
  const { property_ID } = req.params;
  console.log(req.params);

  try {
    const result = await updatePropertyViews(property_ID); //update property views common function to update views in parent table property
    return res.status(200).json({ message: "Views update successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleGetHouseByID = async (req, res) => {
  const { property_ID } = req.params;
  console.log(property_ID);

  try {
    const result = await getHouseByID(property_ID); //get single house
    // if there is house present then also update views
    if (result) {
      await updatePropertyViews(property_ID);
    }
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
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

module.exports = {
  handleAddHouse,
  handleGetHouse,
  handleHouseFeedback,
  handleUpdateHouseViews,
  handleGetHouseByID,
  handleGetPendingHouse,
  handleApproveHouse,
};
