const express = require("express");
const { handleGetPropertyWithAds, handleGetProperty, handleGetPropertyPriorityLocation, handleInsertRequestedProperty, handleGetPropertyAnalytics, handleGetPropertyList, handleInsertPropertyFieldVisitRequest } = require("../../controllers/property/controller.property");
const { handleGetAds } = require("../../controllers/ads/controller.ads");
const { handleGetVideoCarousel } = require("../../controllers/videoCarousel/controller.videoCarousel");
const { handleGetTestimonial } = require("../../controllers/testimonial/controller.testimonial");


const router = express.Router();


// router.post("/requestProperty",handleRequestProperty);


 router.get("/",handleGetPropertyPriorityLocation)
 router.get("/ads",handleGetAds)
 router.get("/list",handleGetPropertyList)



 // property request
 router.post("/request",handleInsertRequestedProperty)


// property field visit Request - 
router.post("/fieldVisit",handleInsertPropertyFieldVisitRequest)



 // property analytics
 router.get("/analytic",handleGetPropertyAnalytics)


 // property video Carousel
 router.get("/videoCarousel",handleGetVideoCarousel)


 //testimonial
 router.get("/testimonial",handleGetTestimonial)
module.exports = router;
