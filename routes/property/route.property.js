const express = require("express");
const { handleGetPropertyWithAds, handleGetProperty, handleGetPropertyPriorityLocation, handleInsertRequestedProperty, handleGetPropertyAnalytics, handleGetPropertyList } = require("../../controllers/property/controller.property");
const { handleGetAds } = require("../../controllers/ads/controller.ads");


const router = express.Router();


// router.post("/requestProperty",handleRequestProperty);


 router.get("/",handleGetPropertyPriorityLocation)
 router.get("/ads",handleGetAds)
 router.get("/list",handleGetPropertyList)

 // property request
 router.post("/request",handleInsertRequestedProperty)



 // property analytics
 router.get("/analytic",handleGetPropertyAnalytics)

module.exports = router;
