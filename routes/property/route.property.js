const express = require("express");
const { handleGetPropertyWithAds } = require("../../controllers/property/controller.property");


const router = express.Router();


// router.post("/requestProperty",handleRequestProperty);


 router.get("/",handleGetPropertyWithAds)


module.exports = router;
