const express = require("express");
const { handleGetPropertyWithAds, handleGetProperty } = require("../../controllers/property/controller.property");


const router = express.Router();


// router.post("/requestProperty",handleRequestProperty);


 router.get("/propertyAds",handleGetPropertyWithAds)
 router.get("/",handleGetProperty)


module.exports = router;
