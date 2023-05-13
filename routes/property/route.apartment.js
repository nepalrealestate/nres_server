const express = require("express");
const router = express.Router();
const {handleAddApartment, handleGetApartment, handleApartmentFeedback, handleUpdateApartmentViews, handleGetApartmentByID} = require("../../controllers/property/controller.apartment");

const {upload} = require("../../middlewares/property/middleware.apartment");

router.post("/",upload.single('image'),handleAddApartment);// insert apartment property
router.get("/",handleGetApartment); // get all apartment 
router.post("/feedback",handleApartmentFeedback); // post single apartment review
router.put("/updateViews/:property_ID",handleUpdateApartmentViews); // update apartment views ( count views )
router.get("/:property_ID",handleGetApartmentByID);// get single apartment and update views also


module.exports = router;