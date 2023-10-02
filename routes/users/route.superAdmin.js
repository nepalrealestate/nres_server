
const express = require("express");

const {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin, superAdminVerifyToken, superAdminVerifyLogin, superAdminLogout} = require('../../controllers/users/controller.superAdmin');
const { handleGetCustomerChatList } = require("../../controllers/chat/controller.customerChat");
const { handleGetStaffChatList, handleInsertStaffGroup, handleDeleteStaffFromGroup } = require("../../controllers/chat/controller.staffChat");
const { handleStaffRegistration, handleGetAllStaff, handleStaffUpdate, handleStaffDelete, handleGetStaffByID } = require("../../controllers/users/controller.staff");
const { handleGetAllAgent } = require("../../controllers/users/controller.agent");
const { handleGetServiceProvider, handleVerifyServiceProvider, handleDeleteServiceProvider, handleGetServiceProviderByID } = require("../../controllers/nres_services/controller.nres_service");
const { handleGetCustomer } = require("../../controllers/users/controller.customer");
const { handleAddApartment, handleGetApartment, handleInsertRequestedApartment, handleGetRequestedApartment, handleUpdateApartmentAds, handleUpdateApartment, handleDeleteApartment, handleGetApartmentByID, handleInsertApartmentComment, handleGetApartmentComment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleGetHouse, handleInsertRequestedHouse, handleGetRequestedHouse, handleUpdateHouse, handleDeleteHouse, handleGetHouseByID, handleInsertHouseComment, handleGetHouseComment, handleUpdateHouseAds } = require("../../controllers/property/controller.house");
const { handleAddLand, handleGetLand, handleInsertRequestedLand, handleGetRequestedLand, handleUpdateLand, handleDeleteLand, handleGetLandByID, handleInsertLandComment, handleGetLandComment, handleUpdateLandAds } = require("../../controllers/property/controller.land");
const { handleInsertPropertyFieldVisitRequest, handleGetPropertyWithAds, handleInsertPropertyShootSchedule, handleGetPropertyShootSchedule, handleInsertPropertyShootScheduleComment, handleGetPropertyShootScheduleComment, handleGetPropertyFieldVisitRequest, handleGetPropertyFieldVisitRequestByID, handleDeletePropertyFieldVisiteRequest, handleUpdatePropertyFieldVisitRequest, handleGetPropertyFieldVisitOTP, handleGetRequestProperty, handleInsertRequestedProperty, handleDeleteRequestedProperty, handleDeletePropertyShootSchedule } = require("../../controllers/property/controller.property");
const { handleInsertBlog, handleGetBlog, handleGetBlogById, handleDeleteBlog } = require("../../controllers/blog/controller.blog");
const { handleInsertOrUpdateAds, handleGetAds } = require("../../controllers/ads/controller.ads");

const router = express.Router();


router.get("/",handleGetSuperAdmin);
router.post("/register",handleSuperAdminRegistration)
router.post("/login",handleSuperAdminLogin)
router.get("/isLoggedIn",superAdminVerifyToken,superAdminVerifyLogin)
router.post("/logout",superAdminLogout)


// chat 
//router.post("chat/add")

router.get("/chat/customerList",handleGetCustomerChatList);
router.get("/chat/staffList",handleGetStaffChatList);
router.post("/chat/staffGroup/:staffID",handleInsertStaffGroup);
router.delete("/chat/staffGroup/:staffID",handleDeleteStaffFromGroup);


// agent chat
//router.get("/chat")


// staff related apis 
router.post("/staff/register",handleStaffRegistration);
router.get("/staff",handleGetAllStaff);
router.get("/staff/:staff_id",handleGetStaffByID)
router.patch("/staff/:staff_id",handleStaffUpdate)
router.delete("/staff/:staff_id",handleStaffDelete);


// agent related routes
router.get("/agent",handleGetAllAgent);


//service provider related routes
router.get("/service/provider",superAdminVerifyToken,handleGetServiceProvider)
router.get("/service/provider/:provider_id",superAdminVerifyToken,handleGetServiceProviderByID)
router.patch("/service/provider/:provider_id",superAdminVerifyToken,handleVerifyServiceProvider)
router.delete("/service/provider/:provider_id",superAdminVerifyToken,handleDeleteServiceProvider);


//customer related routes
router.get("/customer/:customer_id",handleGetCustomer)


// property Related Routes
router.get("/property",superAdminVerifyToken,handleGetPropertyWithAds);
// apartment
router.get("/property/apartment/property_id",superAdminVerifyToken,handleGetApartmentByID)
router.get("/property/apartment",superAdminVerifyToken,handleGetApartment)
router.post("/property/apartment",superAdminVerifyToken,handleAddApartment)
router.patch("/property/apartment/:property_id",superAdminVerifyToken,handleUpdateApartment)
router.delete("/property/apartment/:property_id",superAdminVerifyToken,handleDeleteApartment);

router.post("/property/apartment/comment/:property_id",superAdminVerifyToken,handleInsertApartmentComment)
router.get("/property/apartment/comment/:property_id",superAdminVerifyToken,handleGetApartmentComment)

router.patch("/property/apartment/ads/:property_id",superAdminVerifyToken,handleUpdateApartmentAds)

//house
router.get("/property/house/:property_id",superAdminVerifyToken,handleGetHouseByID)
router.get("/property/house",superAdminVerifyToken,handleGetHouse)
router.post("/property/house",superAdminVerifyToken,handleAddHouse)
router.patch("/property/house/:property_id",superAdminVerifyToken,handleUpdateHouse)
router.delete("/property/house/:property_id",superAdminVerifyToken,handleDeleteHouse)

router.post("/property/house/comment/:property_id",superAdminVerifyToken,handleInsertHouseComment)
router.get("/property/house/comment/:property_id",superAdminVerifyToken,handleGetHouseComment)

router.patch("/property/house/ads/:property_id",superAdminVerifyToken,handleUpdateHouseAds)


//land
router.get("/property/land/:property_id",superAdminVerifyToken,handleGetLandByID)
router.get("/property/land",superAdminVerifyToken,handleGetLand)
router.post("/property/land",superAdminVerifyToken,handleAddLand)
router.patch("/property/land/:property_id",superAdminVerifyToken,handleUpdateLand)
router.delete("/property/land/:property_id",superAdminVerifyToken,handleDeleteLand)

router.post("/property/land/comment/:property_id",superAdminVerifyToken,handleInsertLandComment);
router.get("/property/land/comment/:property_id",superAdminVerifyToken,handleGetLandComment)

router.patch("/property/land/ads/:property_id",superAdminVerifyToken,handleUpdateLandAds)

//property request
router.post("/property/request",superAdminVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",superAdminVerifyToken,handleGetRequestProperty)
router.delete("/property/request/:request_id",superAdminVerifyToken,handleDeleteRequestedProperty)


router.post("/property/apartment/request",superAdminVerifyToken,handleInsertRequestedApartment)
router.get("/property/apartment/request",superAdminVerifyToken,handleGetRequestedApartment)

router.post("/property/house/request",superAdminVerifyToken,handleInsertRequestedHouse)
router.get("/property/house/request",superAdminVerifyToken,handleGetRequestedHouse)

router.post("/property/land/request",superAdminVerifyToken,handleInsertRequestedLand)
router.get("/property/land/request",superAdminVerifyToken,handleGetRequestedLand)

// field visit 
router.post("/property/field-visit-request",superAdminVerifyToken,handleInsertPropertyFieldVisitRequest)

router.get("/property/field-visit-request",superAdminVerifyToken,handleGetPropertyFieldVisitRequest)

router.get("/property/field-visit-request/:field_visit_id",superAdminVerifyToken,handleGetPropertyFieldVisitRequestByID);

router.patch("/property/field-visit-request/:field_visit_id",superAdminVerifyToken,handleUpdatePropertyFieldVisitRequest)

router.delete("/property/field-visit-request/:field_visit_id",superAdminVerifyToken,handleDeletePropertyFieldVisiteRequest)

router.get("/property/field-visit-request/otp/:field_visit_id",superAdminVerifyToken,handleGetPropertyFieldVisitOTP)

router.post("/property/field-visit-request/comment/:field_visit_id",superAdminVerifyToken,)

// router.post("/property/field-visit-request-otp/:field_visit_id",superAdminVerifyToken,)

//shoot schedule
router.post("/property/shoot-schedule",superAdminVerifyToken,handleInsertPropertyShootSchedule)
router.get("/property/shoot-schedule",superAdminVerifyToken,handleGetPropertyShootSchedule)
router.delete("/property/shoot-schedule/:shoot_schedule_id",superAdminVerifyToken,handleDeletePropertyShootSchedule)
// shoot schedule comment 
router.post("/property/shoot-schedule-comment/:shoot_schedule_id",superAdminVerifyToken,handleInsertPropertyShootScheduleComment);
router.get("/property/shoot-schedule-comment/:shoot_schedule_id",superAdminVerifyToken,handleGetPropertyShootScheduleComment);




//blogs 
router.post("/blog",superAdminVerifyToken,handleInsertBlog);
router.get("/blog",superAdminVerifyToken,handleGetBlog);
router.get("/blog/:id",superAdminVerifyToken,handleGetBlogById);
router.delete("/blog/:id",superAdminVerifyToken,handleDeleteBlog);


//ads
router.post("/ads",superAdminVerifyToken,handleInsertOrUpdateAds);
router.get("/ads",handleGetAds);


module.exports  = router;