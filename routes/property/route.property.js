const express = require("express");
const { handleGetPropertyWithAds, handleGetProperty, handleGetPropertyPriorityLocation } = require("../../controllers/property/controller.property");


const router = express.Router();


// router.post("/requestProperty",handleRequestProperty);


 router.get("/propertyAds",handleGetPropertyWithAds)
 router.get("/",handleGetPropertyPriorityLocation)


module.exports = router;
