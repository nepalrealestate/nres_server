const express = require("express");

const {handleGetStaff, handleStaffRegistration, handleStaffLogin, handleAddVideoLink} = require('../../controllers/users/controller.staff');
const { verifyToken } = require("../../controllers/users/commonAuthCode");
const { handleAddApartment, handleApproveApartment, handleGetPendingApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleApproveHouse, handleGetPendingHouse } = require("../../controllers/property/controller.house");
const { handleAddLand, handleApproveLand, handleGetPendingdLand } = require("../../controllers/property/controller.land");




const router  = express.Router();

router.get("/",verifyToken,handleGetStaff);
router.post("/register",handleStaffRegistration);
router.post("/login",handleStaffLogin);
router.post("/videoLink",handleAddVideoLink);

//testing 

router.post("/addApartment",verifyToken,handleAddApartment);
router.post("/addHouse",verifyToken,handleAddHouse);
router.post("/addLand",verifyToken,handleAddLand);


// get applied property

router.get("/pendingApartment",verifyToken,handleGetPendingApartment);
router.get("/unapprovedHouse",verifyToken,handleGetPendingHouse)
router.get("/unapprovedLand",verifyToken,handleGetPendingdLand)
//approved apply for listing apartment

router.put("/approvedApartment/:property_id",verifyToken,handleApproveApartment);
router.put("/approvedHouse/:property_id",verifyToken,handleApproveHouse);
router.put("/approvedLand/:property_id",verifyToken,handleApproveLand);


module.exports = router;