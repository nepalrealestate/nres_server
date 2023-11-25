const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating, handleUpdateProfile, handleUpdateAgentProfile, handleUpdateAgentPassword, agentVerifyToken } = require("../../controllers/users/controller.agent");

const {  handleAddPendingApartment } = require("../../controllers/property/controller.apartment");
const { handleAddPendingHouse, handleGetHouse } = require("../../controllers/property/controller.house");
const { handleAddPendingLand, handleGetLand } = require("../../controllers/property/controller.land");
const { handleCountLisitingProperty, handleInsertRequestedProperty, handleGetRequestProperty, handleGetProperty, handleGetPropertyPriorityLocation } = require("../../controllers/property/controller.property");

const router  = express.Router();




router.get("/",agentVerifyToken,handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.post("/forgetPassword",handleAgentPasswordReset);
router.post("/rating",handleAgentRating)


router.get("/isLoggedIn",agentVerifyToken,async (req, res) => {
    return res
      .status(200)
      .json({ message: "Agent Logged In", user_id: req.id, role: "agent" });
  })

router.put("/updateProfile",agentVerifyToken,handleUpdateAgentProfile);
router.put("/updatePassword",agentVerifyToken,handleUpdateAgentPassword);


// property agent
router.get("/property",agentVerifyToken,handleGetPropertyPriorityLocation)

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