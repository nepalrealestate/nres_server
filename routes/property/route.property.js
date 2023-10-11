const express = require("express");
const { handleGetPropertyWithAds, handleGetProperty, handleGetPropertyPriorityLocation, handleInsertRequestedProperty } = require("../../controllers/property/controller.property");
const { handleGetAds } = require("../../controllers/ads/controller.ads");


const router = express.Router();


// router.post("/requestProperty",handleRequestProperty);


 router.get("/propertyAds",handleGetPropertyWithAds)
 router.get("/",handleGetPropertyPriorityLocation)
 router.get("/ads",handleGetAds)

 // property request
 router.post("/request",handleInsertRequestedProperty)


module.exports = router;
