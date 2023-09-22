
const express = require("express");

const {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin, superAdminVerifyToken, superAdminVerifyLogin, superAdminLogout} = require('../../controllers/users/controller.superAdmin');
const { handleGetCustomerChatList } = require("../../controllers/chat/controller.customerChat");
const { handleGetStaffChatList, handleInsertStaffGroup, handleDeleteStaffFromGroup } = require("../../controllers/chat/controller.staffChat");
const { handleStaffRegistration, handleGetAllStaff, handleStaffUpdate, handleStaffDelete, handleGetStaffByID } = require("../../controllers/users/controller.staff");
const { handleGetAllAgent } = require("../../controllers/users/controller.agent");
const { handleGetServiceProvider } = require("../../controllers/nres_services/controller.nres_service");
const { handleGetCustomer } = require("../../controllers/users/controller.customer");
const { handleAddApartment, handleGetApartment, handleInsertRequestedApartment, handleGetRequestedApartment, handleUpdateApartmentAds, handleUpdateApartment, handleDeleteApartment, handleGetApartmentByID, handleInsertApartmentComment, handleGetApartmentComment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleGetHouse, handleInsertRequestedHouse, handleGetRequestedHouse, handleUpdateHouse, handleDeleteHouse, handleGetHouseByID, handleInsertHouseComment, handleGetHouseComment } = require("../../controllers/property/controller.house");
const { handleAddLand, handleGetLand, handleInsertRequestedLand, handleGetRequestedLand, handleUpdateLand, handleDeleteLand, handleGetLandByID, handleInsertLandComment, handleGetLandComment } = require("../../controllers/property/controller.land");
const { handleInsertPropertyFieldVisitRequest, handleGetPropertyWithAds, handleInsertPropertyShootSchedule, handleGetPropertyShootSchedule, handleInsertPropertyShootScheduleComment, handleGetPropertyShootScheduleComment } = require("../../controllers/property/controller.property");

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
router.get("/service/provider",handleGetServiceProvider)


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

//house
router.get("/property/house/:property_id",superAdminVerifyToken,handleGetHouseByID)
router.get("/property/house",superAdminVerifyToken,handleGetHouse)
router.post("/property/house",superAdminVerifyToken,handleAddHouse)
router.patch("/property/house/:property_id",superAdminVerifyToken,handleUpdateHouse)
router.delete("/property/house/:property_id",superAdminVerifyToken,handleDeleteHouse)

router.post("/property/house/comment/:property_id",superAdminVerifyToken,handleInsertHouseComment)
router.get("/property/house/comment/:property_id",superAdminVerifyToken,handleGetHouseComment)

//land
router.get("/property/land/:property_id",superAdminVerifyToken,handleGetLandByID)
router.get("/property/land",superAdminVerifyToken,handleGetLand)
router.post("/property/land",superAdminVerifyToken,handleAddLand)
router.patch("/property/land/:property_id",superAdminVerifyToken,handleUpdateLand)
router.delete("/property/land/:property_id",superAdminVerifyToken,handleDeleteLand)

router.post("/property/land/comment/:property_id",superAdminVerifyToken,handleInsertLandComment);
router.get("/property/land/comment/:property_id",superAdminVerifyToken,handleGetLandComment)



router.post("/property/apartment/request",superAdminVerifyToken,handleInsertRequestedApartment)
router.get("/property/apartment/request",superAdminVerifyToken,handleGetRequestedApartment)

router.post("/property/house/request",superAdminVerifyToken,handleInsertRequestedHouse)
router.get("/property/house/request",superAdminVerifyToken,handleGetRequestedHouse)

router.post("/property/land/request",superAdminVerifyToken,handleInsertRequestedLand)
router.get("/property/land/request",superAdminVerifyToken,handleGetRequestedLand)

// field visit 
router.post("/property/field-visit-request",superAdminVerifyToken,handleInsertPropertyFieldVisitRequest)

//shoot schedule
router.post("/property/shoot-schedule",superAdminVerifyToken,handleInsertPropertyShootSchedule)
router.get("/property/shoot-schedule",superAdminVerifyToken,handleGetPropertyShootSchedule)

// shoot schedule comment 
router.post("/property/shoot-schedule-comment/:shoot_schedule_id",superAdminVerifyToken,handleInsertPropertyShootScheduleComment);
router.get("/property/shoot-schedule-comment/:shoot_schedule_id",superAdminVerifyToken,handleGetPropertyShootScheduleComment);

module.exports  = router;