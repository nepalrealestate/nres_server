const express = require("express");
const router = express.Router();
const {handleAddApartment, handleGetApartment, handleApartmentFeedback, handleUpdateApartmentViews, handleGetApartmentByID} = require("../../controllers/property/controller.apartment");
const { verifyToken } = require("../../controllers/users/commonAuthCode");


router.post("/",handleAddApartment);// insert apartment property
router.get("/",handleGetApartment); // get all apartment 
router.post("/feedback",handleApartmentFeedback); // post single apartment review
router.put("/updateViews/:property_ID",handleUpdateApartmentViews); // update apartment views ( count views )
router.get("/:property_ID",handleGetApartmentByID);// get single apartment and update views also




// testing code 





module.exports = router;