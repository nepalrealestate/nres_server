
const express = require("express");

const {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin, superAdminVerifyToken, superAdminVerifyLogin, superAdminLogout} = require('../../controllers/users/controller.superAdmin');
const { handleGetCustomerChatList, handleGetSingleCustomerChat } = require("../../controllers/chat/controller.customerChat");
const { handleGetStaffChatList, handleInsertStaffGroup, handleDeleteStaffFromGroup } = require("../../controllers/chat/controller.staffChat");
const { handleStaffRegistration, handleGetAllStaff, handleStaffUpdate, handleStaffDelete, handleGetStaffByID } = require("../../controllers/users/controller.staff");
const { handleGetAllAgent } = require("../../controllers/users/controller.agent");
const { handleGetServiceProvider, handleVerifyServiceProvider, handleDeleteServiceProvider, handleGetServiceProviderByID } = require("../../controllers/nres_services/controller.nres_service");
const { handleGetCustomer, handleGetCustomerByID, handleGetBuyer, handleGetSeller, handleGetSellerByID } = require("../../controllers/users/controller.customer");
const { handleAddApartment, handleGetApartment, handleUpdateApartmentAds, handleUpdateApartment, handleDeleteApartment, handleGetApartmentByID, handleInsertApartmentComment, handleGetApartmentComment, handleSoldApartment, handleGetSoldApartmentByID, handleApproveApartment, handleGetPendingApartmentByID, handleDeletePendingApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleGetHouse, handleUpdateHouse, handleDeleteHouse, handleGetHouseByID, handleInsertHouseComment, handleGetHouseComment, handleUpdateHouseAds, handleSoldHouse, handleGetSoldHouseByID, handleApproveHouse, handleGetPendingHouseByID, handleDeletePendingHouse } = require("../../controllers/property/controller.house");
const { handleAddLand, handleGetLand, handleUpdateLand, handleDeleteLand, handleGetLandByID, handleInsertLandComment, handleGetLandComment, handleUpdateLandAds, handleSoldLand, handleGetSoldLandByID, handleApproveLand, handleGetPendingLandByID, handleDeletePendingLand } = require("../../controllers/property/controller.land");
const { handleInsertPropertyFieldVisitRequest, handleGetPropertyWithAds, handleInsertPropertyShootSchedule, handleGetPropertyShootSchedule, handleInsertPropertyShootScheduleComment, handleGetPropertyShootScheduleComment, handleGetPropertyFieldVisitRequest, handleGetPropertyFieldVisitRequestByID, handleDeletePropertyFieldVisiteRequest, handleUpdatePropertyFieldVisitRequest, handleGetPropertyFieldVisitOTP, handleGetRequestProperty, handleInsertRequestedProperty, handleDeleteRequestedProperty, handleDeletePropertyShootSchedule, handleGetRequestPropertyByID, handleGetSoldProperty, handleGetPendingProperty } = require("../../controllers/property/controller.property");
const { handleInsertBlog, handleGetBlog, handleGetBlogById, handleDeleteBlog } = require("../../controllers/blog/controller.blog");
const { handleInsertOrUpdateAds, handleGetAds } = require("../../controllers/ads/controller.ads");
const { handleGetNotification, handleUpdateNotificationSeen } = require("../../controllers/notification/controller.notification");

const router = express.Router();


router.get("/",handleGetSuperAdmin);
router.post("/register",handleSuperAdminRegistration)
router.post("/login",handleSuperAdminLogin)
router.get("/isLoggedIn",superAdminVerifyToken,superAdminVerifyLogin)
router.post("/logout",superAdminLogout)


// chat 
//router.post("chat/add")

router.get("/chat/customer/list",handleGetCustomerChatList);
router.get("/chat/:customer_id",handleGetSingleCustomerChat)
router.get("/chat/staff/list",handleGetStaffChatList);
router.post("/chat/staff/group/:staffID",handleInsertStaffGroup);
router.delete("/chat/staff/group/:staffID",handleDeleteStaffFromGroup);


// agent chat
//router.get("/chat")


// staff related apis 
router.post("/staff/register",superAdminVerifyToken,handleStaffRegistration);
router.get("/staff",superAdminVerifyToken,handleGetAllStaff);
router.get("/staff/:staff_id",superAdminVerifyToken,handleGetStaffByID)
router.patch("/staff/:staff_id",superAdminVerifyToken,handleStaffUpdate)
router.delete("/staff/:staff_id",superAdminVerifyToken,handleStaffDelete);


// agent related routes
router.get("/agent",handleSuperAdminLogin,handleGetAllAgent);


//customer 
router.get("/customer",superAdminVerifyToken,handleGetCustomer);
// router.get("/customer/:customer_id",superAdminVerifyToken,handleGetCustomerByID);
router.get("/customer/buyer",superAdminVerifyToken,handleGetBuyer)
router.get("/customer/seller",superAdminVerifyToken,handleGetSeller)
router.get("/customer/seller/:seller_id",superAdminVerifyToken,handleGetSellerByID)

//service provider related routes
router.get("/service/provider",superAdminVerifyToken,handleGetServiceProvider)
router.get("/service/provider/:provider_id",superAdminVerifyToken,handleGetServiceProviderByID)
router.patch("/service/provider/:provider_id",superAdminVerifyToken,handleVerifyServiceProvider)
router.delete("/service/provider/:provider_id",superAdminVerifyToken,handleDeleteServiceProvider);




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
router.get("/property/request/:request_id",superAdminVerifyToken,handleGetRequestPropertyByID)
router.delete("/property/request/:request_id",superAdminVerifyToken,handleDeleteRequestedProperty)

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
router.get("/ads",superAdminVerifyToken,handleGetAds);



//sold property
router.post("/property/apartment/sold/:property_id",superAdminVerifyToken,handleSoldApartment)

router.post("/property/house/sold/:property_id",superAdminVerifyToken,handleSoldHouse)

router.post("/property/land/sold/:property_id",superAdminVerifyToken,handleSoldLand)

router.get("/property/sold",superAdminVerifyToken,handleGetSoldProperty)

router.get("/property/land/sold/:property_id",superAdminVerifyToken,handleGetSoldLandByID)
router.get("/property/house/sold/:property_id",superAdminVerifyToken,handleGetSoldHouseByID)
router.get("/property/apartment/sold/:property_id",superAdminVerifyToken,handleGetSoldApartmentByID)



// pending property 
router.get("/property/pending",superAdminVerifyToken,handleGetPendingProperty)
router.get("/property/house/pending/:property_id",superAdminVerifyToken,handleGetPendingHouseByID)
router.get("/property/apartment/pending/:property_id",superAdminVerifyToken,handleGetPendingApartmentByID)
router.get("/property/land/pending/:property_id",superAdminVerifyToken,handleGetPendingLandByID)


// delete pending property
router.delete("/property/house/pending/:property_id",superAdminVerifyToken,handleDeletePendingHouse)
router.delete("/property/apartment/pending/:property_id",superAdminVerifyToken,handleDeletePendingApartment)
router.delete("/property/land/pending/:property_id",superAdminVerifyToken,handleDeletePendingLand)

// approved property
router.post("/property/house/approved/:property_id",superAdminVerifyToken,handleApproveHouse)

router.post("/property/apartment/approved/:property_id",superAdminVerifyToken,handleApproveApartment)

router.post("/property/land/approved/:property_id",superAdminVerifyToken,handleApproveLand)




// notification
router.get("/notification",superAdminVerifyToken,handleGetNotification);
router.patch("/notification/:notificationID",superAdminVerifyToken,handleUpdateNotificationSeen)



module.exports  = router; 