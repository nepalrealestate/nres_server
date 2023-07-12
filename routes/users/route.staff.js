const express = require("express");

const {handleGetStaff, handleStaffRegistration, handleStaffLogin, handleAddVideoLink} = require('../../controllers/users/controller.staff');
const { verifyToken } = require("../../controllers/users/commonAuthCode");
const { handleAddApartment, handleApproveApartment, handleGetPendingApartment, handleUpdateApartmentAds, handleInsertApartmentComment, handleGetApartment, handleGetApartmentComment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleApproveHouse, handleGetPendingHouse, handleUpdateHouseAds, handleGetHouse, handleInsertHouseComment, handleGetHouseComment } = require("../../controllers/property/controller.house");
const { handleAddLand, handleApproveLand, handleGetPendingdLand, handleUpdateLandAds, handleInsertLandComment, handleGetLandComment } = require("../../controllers/property/controller.land");
const { handleGetLatestPropertyDashboard } = require("../../controllers/property/controller.property");
const { handleGetAllAgent } = require("../../controllers/users/controller.agent");




const router  = express.Router();

router.get("/",verifyToken,handleGetStaff);
router.post("/register",handleStaffRegistration);
router.post("/login",handleStaffLogin);
router.post("/videoLink",handleAddVideoLink);

//testing 

// get property
router.get("/house",verifyToken,handleGetHouse);


router.post("/addApartment",verifyToken,handleAddApartment);
router.post("/addHouse",verifyToken,handleAddHouse);
router.post("/addLand",verifyToken,handleAddLand);


// get applied property

router.get("/pendingApartment",verifyToken,handleGetPendingApartment);
router.get("/pendingHouse",verifyToken,handleGetPendingHouse)
router.get("/pendingLand",verifyToken,handleGetPendingdLand)
//approved apply for listing apartment

router.put("/approvedApartment/:property_id",verifyToken,handleApproveApartment);
router.put("/approvedHouse/:property_id",verifyToken,handleApproveHouse);
router.put("/approvedLand/:property_id",verifyToken,handleApproveLand);


//update property 


//update property ads status
router.put("/house/ads/:property_id",verifyToken,handleUpdateHouseAds);
router.put("/apartment/ads/:property_id",verifyToken,handleUpdateApartmentAds);
router.put("/land/ads/:property_id",verifyToken,handleUpdateLandAds);

//insert property comments for staff

router.post("/house/comment/:property_id",verifyToken,handleInsertHouseComment);
router.post("/apartment/comment/:property_id",verifyToken,handleInsertApartmentComment);
router.post("/land/comment/:property_id",verifyToken,handleInsertLandComment);


// get property comments by id

router.get("/house/comment/:property_id",verifyToken,handleGetHouseComment)

router.get("/apartment/comment/:property_id",verifyToken,handleGetApartmentComment)

router.get("/land/comment/:property_id",verifyToken,handleGetLandComment)


//get latest property for dashboard;
router.get("/property",verifyToken,handleGetLatestPropertyDashboard);




//get all agents

router.get("/agent",verifyToken,handleGetAllAgent)

//router.get("/staff");
//router.get("/user")

//get all customer

module.exports = router;