const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating, handleUpdateProfile, handleUpdateAgentProfile, handleUpdateAgentPassword, agentVerifyToken } = require("../../controllers/users/controller.agent");

const { handleAddApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse } = require("../../controllers/property/controller.house");
const { handleAddLand } = require("../../controllers/property/controller.land");

const router  = express.Router();



router.get("/",agentVerifyToken,handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/resetPassword",handleAgentPasswordReset);
router.post("/rating",handleAgentRating)

router.put("/updateProfile",agentVerifyToken,handleUpdateAgentProfile);
router.put("/updatePassword",agentVerifyToken,handleUpdateAgentPassword);

// testing code

router.post("/addApartment",agentVerifyToken,handleAddApartment);
router.post("/addHouse",agentVerifyToken,handleAddHouse);
router.post("/addLand",agentVerifyToken,handleAddLand);




module.exports = router;