const express = require("express");

const {handleGetStaff, handleStaffRegistration, handleStaffLogin, handleAddVideoLink} = require('../../controllers/users/controller.staff');
const { verifyToken } = require("../../controllers/users/commonAuthCode");
const { handleAddApartment, handleApproveApartment, handleGetUnapprovedApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleApproveHouse, handleGetUnapprovedHouse } = require("../../controllers/property/controller.house");
const { handleAddLand, handleApproveLand, handleGetUnapprovedLand } = require("../../controllers/property/controller.land");




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

router.get("/unapprovedApartment",verifyToken,handleGetUnapprovedApartment);
router.get("/unapprovedHouse",verifyToken,handleGetUnapprovedHouse)
router.get("/unapprovedLand",verifyToken,handleGetUnapprovedLand)
//approved apply for listing apartment

router.put("/approvedApartment/:property_id",verifyToken,handleApproveApartment);
router.put("/approvedHouse/:property_id",verifyToken,handleApproveHouse);
router.put("/approvedLand/:property_id",verifyToken,handleApproveLand);


module.exports = router;