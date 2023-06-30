const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const {
  insertApartmentProperty,
  getApartmentProperty,
  insertApartmentFeedback,
  getApartmentByID,
  approveApartment,
  insertUnapprovedApartmentProperty,
  getUnapprovedApartmentProperty,
  getUnapprovedApartmentByID,
} = require("../../models/property/model.apartment");
const {
  updatePropertyViews,
} = require("../../models/property/model.property");

const path = "uploads/property/apartment/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;

const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");
const {Utility} = require("../controller.utils");
const utils = new Utility();


// ------------------------------------------INSERT DATA RELATED ---------------------------------

const handleAddApartment = async (req, res) => {

  upload(req, res, async function (err) {
    utils.handleMulterError(req,res,err,addApartment,true);
  });

  
  async function addApartment (){
    // get user id from req.id i.e we set req.id when verify token
    const user_id = req.id;
    // baseUrl provide us from where request coming from ex. /agent,/staff,/seller
    const user_type = req.baseUrl.substring(1);

    if (!req.body.property) {
      return res.status(400).json({ message: "missing property " });
    }

    let { property, apartmentProperty, location, area } = JSON.parse(
      req.body.property
    );

    const imageObject = JSON.stringify(
      images.reduce(
        (acc, value, index) => ({ ...acc, [index]: value.path }),
        {}
      )
    );

    // update object - store some value
    const property_id = property.property_id;
    property = {
      ...property,
      property_image: imageObject,
      user_id: user_id,
      user_type: user_type,
    };
    apartmentProperty = { property_id: property_id, ...apartmentProperty };
    location = { property_id: property_id, ...location };
    area = { property_id: property_id, ...area };

    

    try {
      //await insertApartmentProperty(property,apartmentProperty,user_id,user_type);

      await insertUnapprovedApartmentProperty(
        property,
        apartmentProperty,
        location,
        area
      );

      return res.status(200).json({ message: "Insert into table" });
    } catch (error) {
      console.log("Why this error", error);
      return res.status(400).json({ message: error });
    }
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
  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  try {
    const apartmentData = await getApartmentProperty(req.query, limit, offSet);
    console.log(apartmentData);

    return res.status(200).json(apartmentData);
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleGetUnapprovedApartment = async (req, res) => {
  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  try {
    const apartmentData = await getUnapprovedApartmentProperty(
      req.query,
      limit,
      offSet
    );
    console.log(apartmentData);

    return res.status(200).json(apartmentData);
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
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
    apartment = await getUnapprovedApartmentByID(property_id); //testing this function needed or not
    if (apartment === undefined || apartment === null) {
      return res.status(400).json({ message: "No Apartment" });
    }
    await approveApartment(staff_id, property_id);
    return res.status(200).json({ message: "approve successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "approved denied ! please try later" });
  }
};

module.exports = {
  handleAddApartment,
  handleGetApartment,
  handleApartmentFeedback,
  handleUpdateApartmentViews,
  handleGetApartmentByID,
  handleGetUnapprovedApartment,
  handleApproveApartment,
};
