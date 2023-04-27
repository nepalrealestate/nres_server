const express = require("express");
const router = express.Router();
const {handleAddApartment, handleGetApartment, handleApartmentFeedback} = require("../../controllers/property/controller.apartment");

router.post("/",handleAddApartment);
router.get("/",handleGetApartment);
router.post("/feedback",handleApartmentFeedback);


module.exports = router;