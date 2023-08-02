const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const {
  insertApartmentProperty,
  getApartmentProperty,
  insertApartmentFeedback,
  getApartmentByID,
 // approveApartment,
  insertUnapprovedApartmentProperty,
  getUnapprovedApartmentProperty,
  getUnapprovedApartmentByID,
  insertPendingApartmentProperty,
  getPendingApartmentProperty,
 // getPendingApartmentByID,
  updateApartmentAds,
  insertApartmentComment,
  getApartmentComment,
} = require("../../models/property/model.apartment");
const {
  updatePropertyViews,
} = require("../../models/property/model.property");

const path = "uploads/property/apartment/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;

const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");
const {Utility} = require("../controller.utils");
const { insertPendingApartment, getPendingApartment, approveApartment, getPendingApartmentByID } = require("../../models/services/property/service.apartment");
const utils = new Utility();


// ------------------------------------------INSERT DATA RELATED ---------------------------------

const handleAddApartment = async (req, res) => {

  upload(req, res, async function (err) {
    utils.handleMulterError(req,res,err,addApartment,true);
  });

  
  async function addApartment (){
    utils.handleAddProperty(req,res,insertPendingApartment);
  }

};



const handleApartmentFeedback = async (req, res) => {
  const { property_ID, feedback } = req.body;

  try {
    const result = await insertApartmentFeedback(property_ID, feedback);
    return res.status(200).json({ message: "Feedback Submit" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.sqlMessage });
  }
};

// ---------------------------------------------------------GET DATA RELATED-------------------------------------------------------

const handleGetApartment = async (req, res) => {


  utils.getSearchData(req,res,getApartmentProperty);

  
};

const handleGetPendingApartment = async (req, res) => {
 

 
    utils.getSearchData(req,res,getPendingApartment)

};

const handleGetApartmentByID = async (req, res) => {
  const { property_ID } = req.params;
  console.log(property_ID);

  try {
    const result = await getApartmentByID(property_ID); // get single  apartment by property
    // if there is apartment then also update views
    if (result) {
      await updatePropertyViews(property_ID);
    }
    console.log(result);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

//-----------------------------------------------UPDATE RELATED--------------------------------------------------------------

const handleUpdateApartmentViews = async (req, res) => {
  const { property_ID } = req.params;
  console.log(req.params);

  try {
    const result = await updatePropertyViews(property_ID); // update property views common function to update views in parent table property
    return res.status(200).json({ message: "Views update successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleApproveApartment = async (req, res) => {
  // handle approved apartment and shift unapproved apartmnet to approved apartment table

  const { property_id } = req.params;

  console.log(property_id);
  const staff_id = req.id;
  let apartment;
  try {
    apartment = await getPendingApartmentByID(property_id); //testing this function needed or not
    if (apartment === undefined || apartment === null) {
      return res.status(400).json({ message: "No Apartment" });
    }
    await approveApartment(staff_id, property_id);
    return res.status(200).json({ message: "approve successfully" });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "approved denied ! please try later" });
  }
};




const handleUpdateApartmentAds = async (req,res)=>{

  const {property_id} = req.params;
  const {ads_status} = req.body;

  
  try {
    
    const response = await updateApartmentAds(ads_status,property_id)
 
    if(response.affectedRows === 0 ){
      return res.status(400).json({message:"No property to update "})
    }
    return res.status(200).json({message:"Successfully Update ads status"});



  } catch (error) {
    return res.status(500).json({message:"unable to update"});
  }



}


const handleInsertApartmentComment = async function (req,res){

    return utils.handleInsertPropertyComment(req,res,insertApartmentComment);

}

const handleGetApartmentComment = async (req,res)=>{

  return utils.handleGetPropertyComment(req,res,getApartmentComment)

}


module.exports = {
  handleAddApartment,
  handleGetApartment,
  handleApartmentFeedback,
  handleUpdateApartmentViews,
  handleGetApartmentByID,
  handleGetPendingApartment,
  handleApproveApartment,
  handleUpdateApartmentAds,
  handleInsertApartmentComment,
  handleGetApartmentComment
};
