const express = require("express");

const {handleGetStaff, handleStaffRegistration, handleStaffLogin, handleAddVideoLink, handleStaffPasswordReset, staffVerifyToken, handleGetStaffByID} = require('../../controllers/users/controller.staff');

const { handleAddApartment, handleApproveApartment, handleGetPendingApartment, handleUpdateApartmentAds, handleInsertApartmentComment, handleGetApartment, handleGetApartmentComment, handleInsertRequestedApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleApproveHouse, handleGetPendingHouse, handleUpdateHouseAds, handleGetHouse, handleInsertHouseComment, handleGetHouseComment, handleInsertRequestedHouse } = require("../../controllers/property/controller.house");
const { handleAddLand, handleApproveLand, handleGetPendingLand, handleUpdateLandAds, handleInsertLandComment, handleGetLandComment, handleInsertRequestedLand } = require("../../controllers/property/controller.land");

const { handleGetAllAgent } = require("../../controllers/users/controller.agent");
const { insertRequestedLand } = require("../../models/services/property/service.land");
const { handleGetPropertyWithAds } = require("../../controllers/property/controller.property");




const router  = express.Router();

router.get("/",staffVerifyToken,handleGetStaffByID);
router.post("/register",handleStaffRegistration);
router.post("/login",handleStaffLogin);


router.put("/resetPassword",handleStaffPasswordReset);

//testing 
// get latest property for dashboard
router.get("/property",staffVerifyToken,handleGetPropertyWithAds)

// get property
router.get("/house",staffVerifyToken,handleGetHouse);
router.get("/apartment",staffVerifyToken,handleGetApartment)



router.post("/addApartment",staffVerifyToken,handleAddApartment);
router.post("/addHouse",staffVerifyToken,handleAddHouse);
router.post("/addLand",staffVerifyToken,handleAddLand);


// get applied property

router.get("/pendingApartment",staffVerifyToken,handleGetPendingApartment);
router.get("/pendingHouse",staffVerifyToken,handleGetPendingHouse)
router.get("/pendingLand",staffVerifyToken,handleGetPendingLand)
//approved apply for listing apartment

router.put("/approvedApartment/:property_id",staffVerifyToken,handleApproveApartment);
router.put("/approvedHouse/:property_id",staffVerifyToken,handleApproveHouse);
router.put("/approvedLand/:property_id",staffVerifyToken,handleApproveLand);


//update property 


//update property ads status
router.put("/house/ads/:property_id",staffVerifyToken,handleUpdateHouseAds);
router.put("/apartment/ads/:property_id",staffVerifyToken,handleUpdateApartmentAds);
router.put("/land/ads/:property_id",staffVerifyToken,handleUpdateLandAds);

//insert property comments for staff

router.post("/house/comment/:property_id",staffVerifyToken,handleInsertHouseComment);
router.post("/apartment/comment/:property_id",staffVerifyToken,handleInsertApartmentComment);
router.post("/land/comment/:property_id",staffVerifyToken,handleInsertLandComment);


// get property comments by id

router.get("/house/comment/:property_id",staffVerifyToken,handleGetHouseComment)

router.get("/apartment/comment/:property_id",staffVerifyToken,handleGetApartmentComment)

router.get("/land/comment/:property_id",staffVerifyToken,handleGetLandComment)


//get latest property for dashboard;
// router.get("/property",staffVerifyToken,handleGetLatestPropertyDashboard);




//get all agents

router.get("/agent",staffVerifyToken,handleGetAllAgent)

//router.get("/staff");
//router.get("/user")

//get all customer



// requested property
router.post("/requestedApartment",staffVerifyToken,handleInsertRequestedApartment)
router.post("/requestedHouse",staffVerifyToken,handleInsertRequestedHouse);
router.post("/requestedLand",staffVerifyToken,handleInsertRequestedLand)

module.exports = router;