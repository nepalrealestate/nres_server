const express = require("express");

const { handleStaffRegistration, handleStaffLogin, handleStaffPasswordReset, staffVerifyToken, handleGetStaffByID, handleStaffLogout} = require('../../controllers/users/controller.staff');

const { handleAddApartment, handleApproveApartment, handleGetPendingApartment, handleUpdateApartmentAds, handleInsertApartmentComment, handleGetApartment, handleGetApartmentComment, handleInsertRequestedApartment, handleGetApartmentByID, handleUpdateApartment, handleDeleteApartment, handleSoldApartment, handleGetSoldApartmentByID, handleGetPendingApartmentByID, handleDeletePendingApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleApproveHouse, handleGetPendingHouse, handleUpdateHouseAds, handleGetHouse, handleInsertHouseComment, handleGetHouseComment, handleInsertRequestedHouse, handleGetHouseByID, handleUpdateHouse, handleDeleteHouse, handleSoldHouse, handleGetSoldHouseByID, handleGetPendingHouseByID, handleDeletePendingHouse } = require("../../controllers/property/controller.house");
const { handleAddLand, handleApproveLand, handleGetPendingLand, handleUpdateLandAds, handleInsertLandComment, handleGetLandComment, handleInsertRequestedLand, handleGetLandByID, handleUpdateLand, handleDeleteLand, handleSoldLand, handleGetSoldLandByID, handleGetPendingLandByID, handleDeletePendingLand } = require("../../controllers/property/controller.land");

const { handleGetAllAgent } = require("../../controllers/users/controller.agent");
const { insertRequestedLand } = require("../../models/services/property/service.land");
const { handleGetPropertyWithAds, handleInsertRequestedProperty, handleGetRequestProperty, handleGetRequestPropertyByID, handleDeleteRequestedProperty, handleInsertPropertyFieldVisitRequest, handleGetPropertyFieldVisitOTP, handleGetPropertyFieldVisitRequest, handleGetPropertyFieldVisitRequestByID, handleUpdatePropertyFieldVisitRequest, handleDeletePropertyFieldVisiteRequest, handleInsertPropertyShootSchedule, handleGetPropertyShootSchedule, handleDeletePropertyShootSchedule, handleInsertPropertyShootScheduleComment, handleGetPropertyShootScheduleComment, handleGetSoldProperty, handleGetPendingProperty, handleGetPropertyAnalytics } = require("../../controllers/property/controller.property");
const { handleGetCustomer, handleGetBuyer, handleGetSeller, handleGetSellerByID } = require("../../controllers/users/controller.customer");
const { handleGetServiceProvider, handleGetServiceProviderByID, handleVerifyServiceProvider, handleDeleteServiceProvider } = require("../../controllers/nres_services/controller.nres_service");
const { handleInsertBlog, handleGetBlog, handleGetBlogById, handleDeleteBlog } = require("../../controllers/blog/controller.blog");
const { handleInsertOrUpdateAds, handleGetAds } = require("../../controllers/ads/controller.ads");




const router  = express.Router();

router.get("/",staffVerifyToken,handleGetStaffByID);

router.post("/login",handleStaffLogin);
router.post("/logout",handleStaffLogout)


router.put("/forgetPassword",handleStaffPasswordReset);


router.get("/isLoggedIn",staffVerifyToken,async (req, res) => {
    return res
      .status(200)
      .json({ message: "Staff Logged In", user_id: req.id, role: "staff" });
  })


// agent related routes
router.get("/agent",staffVerifyToken,handleGetAllAgent);

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
router.delete("/service/provider/:provider_id",staffVerifyToken,handleDeleteServiceProvider);



// property Related Routes
router.get("/property",staffVerifyToken,handleGetPropertyWithAds);
// apartment
router.get("/property/apartment/property_id",staffVerifyToken,handleGetApartmentByID)
router.get("/property/apartment",staffVerifyToken,handleGetApartment)
router.post("/property/apartment",staffVerifyToken,handleAddApartment)
router.patch("/property/apartment/:property_id",staffVerifyToken,handleUpdateApartment)
router.delete("/property/apartment/:property_id",staffVerifyToken,handleDeleteApartment);

router.post("/property/apartment/comment/:property_id",staffVerifyToken,handleInsertApartmentComment)
router.get("/property/apartment/comment/:property_id",staffVerifyToken,handleGetApartmentComment)

router.patch("/property/apartment/ads/:property_id",staffVerifyToken,handleUpdateApartmentAds)

//house
router.get("/property/house/:property_id",staffVerifyToken,handleGetHouseByID)
router.get("/property/house",staffVerifyToken,handleGetHouse)
router.post("/property/house",staffVerifyToken,handleAddHouse)
router.patch("/property/house/:property_id",staffVerifyToken,handleUpdateHouse)
router.delete("/property/house/:property_id",staffVerifyToken,handleDeleteHouse)

router.post("/property/house/comment/:property_id",staffVerifyToken,handleInsertHouseComment)
router.get("/property/house/comment/:property_id",staffVerifyToken,handleGetHouseComment)

router.patch("/property/house/ads/:property_id",staffVerifyToken,handleUpdateHouseAds)


//land
router.get("/property/land/:property_id",staffVerifyToken,handleGetLandByID)
router.get("/property/land",staffVerifyToken,handleGetLandByID)
router.post("/property/land",staffVerifyToken,handleAddLand)
router.patch("/property/land/:property_id",staffVerifyToken,handleUpdateLand)
router.delete("/property/land/:property_id",staffVerifyToken,handleDeleteLand)

router.post("/property/land/comment/:property_id",staffVerifyToken,handleInsertLandComment);
router.get("/property/land/comment/:property_id",staffVerifyToken,handleGetLandComment)

router.patch("/property/land/ads/:property_id",staffVerifyToken,handleUpdateLandAds)



//property request
router.post("/property/request",staffVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",staffVerifyToken,handleGetRequestProperty)
router.get("/property/request/:request_id",staffVerifyToken,handleGetRequestPropertyByID)
router.delete("/property/request/:request_id",staffVerifyToken,handleDeleteRequestedProperty)

// field visit 
router.post("/property/field-visit-request",staffVerifyToken,handleInsertPropertyFieldVisitRequest)

router.get("/property/field-visit-request",staffVerifyToken,handleGetPropertyFieldVisitRequest)

router.get("/property/field-visit-request/:field_visit_id",staffVerifyToken,handleGetPropertyFieldVisitRequestByID);

router.patch("/property/field-visit-request/:field_visit_id",staffVerifyToken,handleUpdatePropertyFieldVisitRequest)

router.delete("/property/field-visit-request/:field_visit_id",staffVerifyToken,handleDeletePropertyFieldVisiteRequest)

router.get("/property/field-visit-request/otp/:field_visit_id",staffVerifyToken,handleGetPropertyFieldVisitOTP)

router.post("/property/field-visit-request/comment/:field_visit_id",staffVerifyToken,)

// router.post("/property/field-visit-request-otp/:field_visit_id",superAdminVerifyToken,)


//shoot schedule
router.post("/property/shoot-schedule",staffVerifyToken,handleInsertPropertyShootSchedule)
router.get("/property/shoot-schedule",staffVerifyToken,handleGetPropertyShootSchedule)
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



//sold property
router.post("/property/apartment/sold/:property_id",staffVerifyToken,handleSoldApartment)

router.post("/property/house/sold/:property_id",staffVerifyToken,handleSoldHouse)

router.post("/property/land/sold/:property_id",staffVerifyToken,handleSoldLand)

router.get("/property/sold",staffVerifyToken,handleGetSoldProperty)

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

// approved property
router.post("/property/house/approved/:property_id",staffVerifyToken,handleApproveHouse)

router.post("/property/apartment/approved/:property_id",staffVerifyToken,handleApproveApartment)

router.post("/property/land/approved/:property_id",staffVerifyToken,handleApproveLand)




 // property analytics
 router.get("/analytic",staffVerifyToken,handleGetPropertyAnalytics)

module.exports = router;