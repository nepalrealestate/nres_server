const express = require("express");

const {handleGetStaff, handleStaffRegistration, handleStaffLogin, handleAddVideoLink} = require('../../controllers/users/controller.staff');
const { verifyToken } = require("../../controllers/users/commonAuthCode");
const { handleAddApartment, handleApproveApartment, handleGetPendingApartment, handleUpdateApartmentAds } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleApproveHouse, handleGetPendingHouse, handleUpdateHouseAds, handleGetHouse } = require("../../controllers/property/controller.house");
const { handleAddLand, handleApproveLand, handleGetPendingdLand, handleUpdateLandAds } = require("../../controllers/property/controller.land");




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
router.put("/house/ads/:property_id",handleUpdateHouseAds);
router.put("/apartment/ads/:property_id",handleUpdateApartmentAds);
router.put("/land/ads/:property_id",handleUpdateLandAds);

//update property comments for staff


module.exports = router;