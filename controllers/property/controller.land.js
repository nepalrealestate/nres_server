const {
  insertLandProperty,
  getLandProperty,
  insertLandFeedback,
  getLandByID,
  
  approveLand,
  
  insertUnapprovedLandProperty,
  getUnapprovedLandProperty,
  getUnapprovedLandByID,
} = require("../../models/property/model.land");
const { updatePropertyViews } = require("../../models/property/model.property");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const path = "uploads/property/land/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");
const { checkProperties } = require("../requiredObjectProperties");

const handleAddLand = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: err });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: err });
    }

    // Everything went fine.

    if (!req.files) {
      return res
        .status(400)
        .json({ message: "missing images of your property" });
    }
    const images = req.files;

    // get user id from req.id i.e we set req.id when verify token
    const user_id = req.id;
    // baseUrl provide us from where request coming from ex. /agnet,/staff,/seller
    const user_type = req.baseUrl.substring(1);
    
    if (!req.body.property) {
    
      return res.status(400).json({ message: "missing property " });
    }

    let { property, landProperty, location, area } = JSON.parse(
      req.body.property
    );
    //check if desire property filed present or not
   //  if (
   //    !checkProperties.isPropertiesPresent(property, "property") ||
   //    !checkProperties.isPropertiesPresent(landProperty, "land")
   //  ) {
   //    return res.status(400).json({ message: "missing field" });
   //  }

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
    landProperty = { property_id: property_id, ...landProperty };
    location = { property_id: property_id, ...location };
    area = { property_id: property_id, ...area };

    console.log("Add Land API HITTTTT !!!!!!");
    try {
      await insertUnapprovedLandProperty(
        property,
        landProperty,
        location,
        area
      );
      return res.status(200).json({ message: "Insert into table" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.sqlMessage });
    }
  });
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

const handleGetUnapprovedLand = async (req, res) => {
  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  try {
    const landData = await getUnapprovedLandProperty(req.query, limit, offSet);
    console.log(landData);

    return res.status(200).json(landData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.sqlMessage });
  }
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
  handleGetUnapprovedLand,
  handleApproveLand,
};
