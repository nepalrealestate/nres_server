const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating, handleUpdateProfile, handleUpdateAgentProfile, handleUpdateAgentPassword } = require("../../controllers/users/controller.agent");
const { verifyToken } = require("../../controllers/users/commonAuthCode");
const { handleAddApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse } = require("../../controllers/property/controller.house");
const { handleAddLand } = require("../../controllers/property/controller.land");

const router  = express.Router();



router.get("/",verifyToken,handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/resetPassword",handleAgentPasswordReset);
router.post("/rating",handleAgentRating)

router.put("/updateProfile",verifyToken,handleUpdateAgentProfile);
router.put("/updatePassword",verifyToken,handleUpdateAgentPassword);

// testing code

router.post("/addApartment",verifyToken,handleAddApartment);
router.post("/addHouse",verifyToken,handleAddHouse);
router.post("/addLand",verifyToken,handleAddLand);




module.exports = router;