const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const {
  insertHouseProperty,
  getHouseProperty,
  insertHouseFeedback,
  getHouseByID,
  insertUnapprovedHouseProperty,
  approveHouse,
  getUnapprovedHouseProperty,
  getUnapprovedHouseByID,
} = require("../../models/property/model.house");
const { updatePropertyViews } = require("../../models/property/model.property");

const path = "uploads/property/house/images"; //path from source
const maxImageSize = 2 * 1024 * 1024;
const upload = new UploadImage(path, maxImageSize).upload.array("image", 10);
const multer = require("multer");

// only for test purpose

const handleAddHouse = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: err });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: err });
    }

    // Everything went fine.
    const images = req.files;

    if (!req.files) {
      return res
        .status(400)
        .json({ message: "missing images of your property" });
    }

    // get user id from req.id i.e we set req.id when verify token
    const user_id = req.id;
    // baseUrl provide us from where request coming from ex. /agnet,/staff,/seller
    const user_type = req.baseUrl.substring(1);

    if (!req.body.property) {
      return res.status(400).json({ message: "missing property " });
    }

    let { property, houseProperty, location, area } = JSON.parse(
      req.body.property
    );

    const imageObject = JSON.stringify(
      images.reduce(
        (acc, value, index) => ({ ...acc, [index]: value.path }),
        {}
      )
    );

    const property_id = property.property_id;
    property = {
      ...property,
      property_image: imageObject,
      user_id: user_id,
      user_type: user_type,
    };
    houseProperty = { property_id: property_id, ...houseProperty };
    location = { property_id: property_id, ...location };
    area = { property_id: property_id, ...area };
    try {
      await insertUnapprovedHouseProperty(
        property,
        houseProperty,
        location,
        area
      );
      return res.status(200).json({ message: "Insert into table" });
    } catch (error) {
      return res.status(400).json({ message: error.sqlMessage });
    }
  });
};

const handleGetHouse = async (req, res) => {
  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  try {
    const houseData = await getHouseProperty(req.query, limit, offSet);
    console.log(houseData);

    return res.status(200).json(houseData);
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
};

const handleGetUnapprovedHouse = async (req, res) => {
  let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  try {
    const houseData = await getUnapprovedHouseProperty(
      req.query,
      limit,
      offSet
    );
    console.log(houseData);

    return res.status(200).json(houseData);
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage });
  }
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
    house = await getUnapprovedHouseByID(property_id);
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
  handleGetUnapprovedHouse,
  handleApproveHouse,
};
