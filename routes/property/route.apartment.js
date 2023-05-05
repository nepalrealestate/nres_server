const express = require("express");
const router = express.Router();
const {handleAddApartment, handleGetApartment, handleApartmentFeedback, handleUpdateApartmentViews} = require("../../controllers/property/controller.apartment");

router.post("/",handleAddApartment);
router.get("/",handleGetApartment);
router.post("/feedback",handleApartmentFeedback);
router.put("/updateViews/:property_ID",handleUpdateApartmentViews);


module.exports = router;