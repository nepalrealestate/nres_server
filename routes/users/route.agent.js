const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating, handleUpdateProfile, handleUpdateAgentProfile, handleUpdateAgentPassword, agentVerifyToken } = require("../../controllers/users/controller.agent");

const {  handleAddPendingApartment } = require("../../controllers/property/controller.apartment");
const { handleAddPendingHouse, handleGetHouse } = require("../../controllers/property/controller.house");
const { handleAddPendingLand, handleGetLand } = require("../../controllers/property/controller.land");
const { handleCountLisitingProperty, handleInsertRequestedProperty, handleGetRequestProperty } = require("../../controllers/property/controller.property");

const router  = express.Router();




router.get("/",agentVerifyToken,handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/resetPassword",handleAgentPasswordReset);
router.post("/rating",handleAgentRating)

router.put("/updateProfile",agentVerifyToken,handleUpdateAgentProfile);
router.put("/updatePassword",agentVerifyToken,handleUpdateAgentPassword);


// property agent

router.post("/property/house",agentVerifyToken,handleAddPendingHouse);
router.get("/property/house",agentVerifyToken,handleGetHouse);

router.post("/property/land",agentVerifyToken,handleAddPendingLand)
router.get("/property/land",agentVerifyToken,handleGetLand);

router.post("/property/apartment",agentVerifyToken,handleAddPendingApartment);
router.get("/property/apartment",agentVerifyToken,handleGetAgent);


//property count
router.get("/property/count",agentVerifyToken,handleCountLisitingProperty)


// property request
router.post("/property/request",agentVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",agentVerifyToken,handleGetRequestProperty)




module.exports = router;