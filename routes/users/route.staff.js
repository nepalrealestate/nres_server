const express = require("express");

const { handleStaffRegistration, handleStaffLogin, handleStaffPasswordReset, staffVerifyToken, handleGetStaffByID, handleStaffLogout} = require('../../controllers/users/controller.staff');

const { handleAddApartment, handleApproveApartment, handleGetPendingApartment, handleUpdateApartmentAds, handleInsertApartmentComment, handleGetApartment, handleGetApartmentComment, handleInsertRequestedApartment, handleGetApartmentByID, handleUpdateApartment, handleDeleteApartment, handleSoldApartment, handleGetSoldApartmentByID, handleGetPendingApartmentByID, handleDeletePendingApartment, handleUpdateApartmentListingType, handleDeleteApartmentImage } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleApproveHouse, handleGetPendingHouse, handleUpdateHouseAds, handleGetHouse, handleInsertHouseComment, handleGetHouseComment, handleInsertRequestedHouse, handleGetHouseByID, handleUpdateHouse, handleDeleteHouse, handleSoldHouse, handleGetSoldHouseByID, handleGetPendingHouseByID, handleDeletePendingHouse, handleUpdateHouseListingType, handleDeleteHouseImage } = require("../../controllers/property/controller.house");
const { handleAddLand, handleApproveLand, handleGetPendingLand, handleUpdateLandAds, handleInsertLandComment, handleGetLandComment, handleInsertRequestedLand, handleGetLandByID, handleUpdateLand, handleDeleteLand, handleSoldLand, handleGetSoldLandByID, handleGetPendingLandByID, handleDeletePendingLand, handleGetLand, handleUpdateLandListingType, handleDeleteLandImage } = require("../../controllers/property/controller.land");

const { handleGetAllAgent, handleVerifyAgent, handleGetAgentCountByProvince } = require("../../controllers/users/controller.agent");
const { insertRequestedLand } = require("../../models/services/property/service.land");
const { handleGetPropertyWithAds, handleInsertRequestedProperty, handleGetRequestProperty, handleGetRequestPropertyByID, handleDeleteRequestedProperty, handleInsertPropertyFieldVisitRequest, handleGetPropertyFieldVisitOTP, handleGetPropertyFieldVisitRequest, handleGetPropertyFieldVisitRequestByID, handleUpdatePropertyFieldVisitRequest, handleDeletePropertyFieldVisiteRequest, handleInsertPropertyShootSchedule, handleGetPropertyShootSchedule, handleDeletePropertyShootSchedule, handleInsertPropertyShootScheduleComment, handleGetPropertyShootScheduleComment, handleGetSoldProperty, handleGetPendingProperty, handleGetPropertyAnalytics, handleUpdatePropertyShootSchedule, handleScheduleFieldVisitRequest, handleGetHomeLoan, handleDeleteHomeLoan } = require("../../controllers/property/controller.property");
const { handleGetCustomer, handleGetBuyer, handleGetSeller, handleGetSellerByID } = require("../../controllers/users/controller.customer");
const { handleGetServiceProvider, handleGetServiceProviderByID, handleVerifyServiceProvider, handleDeleteServiceProvider } = require("../../controllers/nres_services/controller.nres_service");
const { handleInsertBlog, handleGetBlog, handleGetBlogById, handleDeleteBlog } = require("../../controllers/blog/controller.blog");
const { handleInsertOrUpdateAds, handleGetAds } = require("../../controllers/ads/controller.ads");
const { handleGetNotification, handleUpdateNotificationSeen, handleUpdateAllNotificationSeen } = require("../../controllers/notification/controller.notification");
const { handleGetContact, handleGetContactByID, handleDeleteContact } = require("../../controllers/contact/controller.contact");
const { handleInsertVideoCarousel, handleGetVideoCarousel, handleDeleteVideoCarousel } = require("../../controllers/videoCarousel/controller.videoCarousel");
const { handleInsertTestimonial, handleGetTestimonial, handleGetTestimonialByID, handleDeleteTestimonial } = require("../../controllers/testimonial/controller.testimonial");




const router  = express.Router();

router.get("/",staffVerifyToken,handleGetStaffByID);

router.post("/login",handleStaffLogin);
router.post("/logout",handleStaffLogout)


router.post("/forgetPassword",handleStaffPasswordReset);


router.get("/isLoggedIn",staffVerifyToken,async (req, res) => {
    return res
      .status(200)
      .json({ message: "Staff Logged In", user_id: req.id, role: "staff" });
  })


// routess
// agent related routes
router.get("/agent",staffVerifyToken,handleGetAllAgent);
router.patch("/agent/:agent_id",staffVerifyToken,handleVerifyAgent)
router.get("/agent/count",staffVerifyToken,handleGetAgentCountByProvince);

//todo 1- verify agent
//todo 3- get agent by id
//todo 4- get agent all filteration
//todo 5- only login after verified - middleware 


//customer 
router.get("/customer",staffVerifyToken,handleGetCustomer);
// router.get("/customer/:customer_id",staffVerifyToken,handleGetCustomerByID);
router.get("/customer/buyer",staffVerifyToken,handleGetBuyer)
router.get("/customer/seller",staffVerifyToken,handleGetSeller)
router.get("/customer/seller/:seller_id",staffVerifyToken,handleGetSellerByID)

//service provider related routes
router.get("/service/provider",staffVerifyToken,handleGetServiceProvider)
router.get("/service/provider/:provider_id",staffVerifyToken,handleGetServiceProviderByID)
router.patch("/service/provider/:provider_id",staffVerifyToken,handleVerifyServiceProvider)
router.delete("/service/provider/:provider_id",staffVerifyToken,handleDeleteServiceProvider)






// property Related Routes
router.get("/property",staffVerifyToken,handleGetPropertyWithAds);
router.get("/property/sold",staffVerifyToken,handleGetSoldProperty);

// apartment

router.get("/property/apartment/:property_id",staffVerifyToken,handleGetApartmentByID)
router.get("/property/apartment",staffVerifyToken,handleGetApartment)
router.post("/property/apartment",staffVerifyToken,handleAddApartment)
router.patch("/property/apartment/:property_id",staffVerifyToken,handleUpdateApartment)
router.delete("/property/apartment/:property_id",staffVerifyToken,handleDeleteApartment);
router.patch("/property/apartment/image/:property_id",staffVerifyToken,handleDeleteApartmentImage)

router.post("/property/apartment/comment/:property_id",staffVerifyToken,handleInsertApartmentComment)
router.get("/property/apartment/comment/:property_id",staffVerifyToken,handleGetApartmentComment)

router.patch("/property/apartment/ads/:property_id",staffVerifyToken,handleUpdateApartmentAds)

router.patch("/property/apartment/sold/:property_id",staffVerifyToken,handleSoldApartment)
router.patch("/property/apartment/approved/:property_id",staffVerifyToken,handleApproveApartment)
router.patch("/property/apartment/listingType/:property_id",staffVerifyToken,handleUpdateApartmentListingType)



//house
router.get("/property/house/:property_id",staffVerifyToken,handleGetHouseByID)
router.get("/property/house",staffVerifyToken,handleGetHouse)
router.post("/property/house",staffVerifyToken,handleAddHouse)
router.patch("/property/house/:property_id",staffVerifyToken,handleUpdateHouse)
router.delete("/property/house/:property_id",staffVerifyToken,handleDeleteHouse)
router.patch("/property/house/image/:property_id",staffVerifyToken,handleDeleteHouseImage)

router.post("/property/house/comment/:property_id",staffVerifyToken,handleInsertHouseComment)
router.get("/property/house/comment/:property_id",staffVerifyToken,handleGetHouseComment)

router.patch("/property/house/ads/:property_id",staffVerifyToken,handleUpdateHouseAds)

router.patch("/property/house/sold/:property_id",staffVerifyToken,handleSoldHouse)
router.patch("/property/house/approved/:property_id",staffVerifyToken,handleApproveHouse)
router.patch("/property/house/listingType/:property_id",staffVerifyToken,handleUpdateHouseListingType)



//land
router.get("/property/land/:property_id",staffVerifyToken,handleGetLandByID)
router.get("/property/land",staffVerifyToken,handleGetLand)
router.post("/property/land",staffVerifyToken,handleAddLand)
router.patch("/property/land/:property_id",staffVerifyToken,handleUpdateLand)
router.delete("/property/land/:property_id",staffVerifyToken,handleDeleteLand)
router.patch("/property/land/image/:property_id",staffVerifyToken,handleDeleteLandImage)

router.post("/property/land/comment/:property_id",staffVerifyToken,handleInsertLandComment);
router.get("/property/land/comment/:property_id",staffVerifyToken,handleGetLandComment)

router.patch("/property/land/ads/:property_id",staffVerifyToken,handleUpdateLandAds)

router.patch("/property/land/sold/:property_id",staffVerifyToken,handleSoldLand)
router.patch("/property/land/approved/:property_id",staffVerifyToken,handleApproveLand)
router.patch("/property/land/listingType/:property_id",staffVerifyToken,handleUpdateLandListingType)

//property request
router.post("/property/request",staffVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",staffVerifyToken,handleGetRequestProperty)
router.get("/property/request/:request_id",staffVerifyToken,handleGetRequestPropertyByID)
router.delete("/property/request/:request_id",staffVerifyToken,handleDeleteRequestedProperty)

// field visit 
router.post("/property/field-visit-request",staffVerifyToken,handleInsertPropertyFieldVisitRequest)

router.get("/property/field-visit-request",staffVerifyToken,handleGetPropertyFieldVisitRequest)

router.get("/property/field-visit-request/:field_visit_id",staffVerifyToken,handleGetPropertyFieldVisitRequestByID);

//router.patch("/property/field-visit-request/:field_visit_id",staffVerifyToken,handleUpdatePropertyFieldVisitRequest)

router.delete("/property/field-visit-request/:field_visit_id",staffVerifyToken,handleDeletePropertyFieldVisiteRequest)

router.get("/property/field-visit-request/otp/:field_visit_id",staffVerifyToken,handleGetPropertyFieldVisitOTP)

router.post("/property/field-visit-request/comment/:field_visit_id",staffVerifyToken,)

//schedule field visit status
router.patch("/property/field-visit-request/schedule/:visit_id",staffVerifyToken,handleScheduleFieldVisitRequest)


// router.post("/property/field-visit-request-otp/:field_visit_id",staffVerifyToken,)

//shoot schedule
router.post("/property/shoot-schedule",staffVerifyToken,handleInsertPropertyShootSchedule)
router.get("/property/shoot-schedule",staffVerifyToken,handleGetPropertyShootSchedule)
router.patch("/property/shoot-schedule/:id",staffVerifyToken,handleUpdatePropertyShootSchedule)
router.delete("/property/shoot-schedule/:shoot_schedule_id",staffVerifyToken,handleDeletePropertyShootSchedule)
// shoot schedule comment 
router.post("/property/shoot-schedule-comment/:shoot_schedule_id",staffVerifyToken,handleInsertPropertyShootScheduleComment);
router.get("/property/shoot-schedule-comment/:shoot_schedule_id",staffVerifyToken,handleGetPropertyShootScheduleComment);




//blogs 
router.post("/blog",staffVerifyToken,handleInsertBlog);
router.get("/blog",staffVerifyToken,handleGetBlog);
router.get("/blog/:id",staffVerifyToken,handleGetBlogById);
router.delete("/blog/:id",staffVerifyToken,handleDeleteBlog);


//ads
router.post("/ads",staffVerifyToken,handleInsertOrUpdateAds);
router.get("/ads",staffVerifyToken,handleGetAds);



//sold prop

// router.get("/property/sold",staffVerifyToken,handleGetSoldProperty)

router.get("/property/land/sold/:property_id",staffVerifyToken,handleGetSoldLandByID)
router.get("/property/house/sold/:property_id",staffVerifyToken,handleGetSoldHouseByID)
router.get("/property/apartment/sold/:property_id",staffVerifyToken,handleGetSoldApartmentByID)



// pending property 
router.get("/property/pending",staffVerifyToken,handleGetPendingProperty)
router.get("/property/house/pending/:property_id",staffVerifyToken,handleGetPendingHouseByID)
router.get("/property/apartment/pending/:property_id",staffVerifyToken,handleGetPendingApartmentByID)
router.get("/property/land/pending/:property_id",staffVerifyToken,handleGetPendingLandByID)


// delete pending property
router.delete("/property/house/pending/:property_id",staffVerifyToken,handleDeletePendingHouse)
router.delete("/property/apartment/pending/:property_id",staffVerifyToken,handleDeletePendingApartment)
router.delete("/property/land/pending/:property_id",staffVerifyToken,handleDeletePendingLand)





// notification
router.get("/notification",staffVerifyToken,handleGetNotification);
router.patch("/notification/:notificationID",staffVerifyToken,handleUpdateNotificationSeen)
router.patch("/notification",staffVerifyToken,handleUpdateAllNotificationSeen)



 // property analytics
router.get("/analytic",staffVerifyToken,handleGetPropertyAnalytics)


 // contact
router.get("/contact",staffVerifyToken,handleGetContact);
router.get("/contact/:id",staffVerifyToken,handleGetContactByID);
router.delete("/contact/:id",staffVerifyToken,handleDeleteContact);

// video carousel
router.post("/videoCarousel",staffVerifyToken,handleInsertVideoCarousel);
router.get("/videoCarousel",staffVerifyToken,handleGetVideoCarousel);
router.delete("/videoCarousel/:id",staffVerifyToken,handleDeleteVideoCarousel);

//testimonial
router.post("/testimonial",staffVerifyToken,handleInsertTestimonial);
router.get("/testimonial",staffVerifyToken,handleGetTestimonial);
router.get("/testimonial/:id",staffVerifyToken,handleGetTestimonialByID);
router.delete("/testimonial/:id",staffVerifyToken,handleDeleteTestimonial);



//home loand
router.get("/property/homeLoan",staffVerifyToken,handleGetHomeLoan)
router.delete("/property/homeLoan/:id",staffVerifyToken,handleDeleteHomeLoan)






module.exports = router;