const {
  insertLandProperty,
  getLandProperty,
  insertLandFeedback,
  getLandByID,
  
  approveLand,
  
  insertUnapprovedLandProperty,
  getUnapprovedLandProperty,
  getUnapprovedLandByID,
  insertPendingLandProperty,
  getPendingLandProperty,
} = require("../../models/property/model.land");
const { updatePropertyViews } = require("../../models/property/model.property");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const path = "uploads/property/land/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");
const { checkProperties } = require("../requiredObjectProperties");
const {Utility} = require("../controller.utils");
const utils = new Utility();


const handleAddLand = async (req, res) => {
  
  upload(req, res, async function (err) {
   
    utils.handleMulterError(req,res,err,addLand,true);
  });
  
  async function addLand(){

   utils.handleAddProperty( req,res,insertPendingLandProperty);
  }
      
    
};

const handleGetLand = async (req, res) => {
  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  try {
    const landData = await getLandProperty(req.query, limit, offSet);
    console.log(landData);

    return res.status(200).json(landData);
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleGetPendingdLand = async (req, res) => {

    utils.getSearchData(req,res,getPendingLandProperty)
   

};

const handleLandFeedback = async (req, res) => {
  const { property_ID, feedback } = req.body;

  try {
    const result = await insertLandFeedback(property_ID, feedback);
    return res.status(200).json({ message: "Feedback Submit" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.sqlMessage });
  }
};
const handleUpdateLandViews = async (req, res) => {
  const { property_ID } = req.params;
  console.log(req.params);

  try {
    const result = await updatePropertyViews(property_ID); // update property views common function to update views in parent table property;
    return res.status(200).json({ message: "Views update successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleGetLandByID = async (req, res) => {
  const { property_ID } = req.params;

  try {
    const result = await getLandByID(property_ID); //get single land
    //if there is land present then update views also;
    if (result) {
      await updatePropertyViews(property_ID);
    }
    console.log(result);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleApproveLand = async (req, res) => {
  const { property_id } = req.params;
  console.log(property_id);
  const staff_id = req.id;

  let land;

  try {
    land = await getUnapprovedLandByID(property_id);
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

module.exports = {
  handleAddLand,
  handleGetLand,
  handleLandFeedback,
  handleUpdateLandViews,
  handleGetLandByID,
  handleGetPendingdLand,
  handleApproveLand,
};
