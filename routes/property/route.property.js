const express = require("express");
const { handleGetPropertyWithAds, handleGetProperty, handleGetPropertyPriorityLocation, handleInsertRequestedProperty, handleGetPropertyAnalytics, handleGetPropertyList, handleInsertPropertyFieldVisitRequest, handleInsertHomeLoan } = require("../../controllers/property/controller.property");
const { handleGetAds } = require("../../controllers/ads/controller.ads");
const { handleGetVideoCarousel } = require("../../controllers/videoCarousel/controller.videoCarousel");
const { handleGetTestimonial } = require("../../controllers/testimonial/controller.testimonial");
const { getHomeLoan, deleteHomeLoan } = require("../../models/services/property/service.property");


const router = express.Router();


// router.post("/requestProperty",handleRequestProperty);


 router.get("/",handleGetPropertyPriorityLocation)
 router.get("/list",handleGetPropertyList)

 


 // property analytics
 router.get("/analytic",handleGetPropertyAnalytics)


 // property video Carousel
 router.get("/videoCarousel",handleGetVideoCarousel)


 //testimonial
 router.get("/testimonial",handleGetTestimonial)

//home loan
router.post("/homeLoan",handleInsertHomeLoan)


module.exports = router;
