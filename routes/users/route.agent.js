const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating, handleUpdateProfile, handleUpdateAgentProfile, handleUpdateAgentPassword, agentVerifyToken, handleGetAgentIsLoggedIn } = require("../../controllers/users/controller.agent");

const { handleAddApartment } = require("../../controllers/property/controller.apartment");
const { handleGetHouse, handleAddHouse } = require("../../controllers/property/controller.house");
const { handleGetLand, handleAddLand } = require("../../controllers/property/controller.land");
const { handleCountLisitingProperty, handleInsertRequestedProperty, handleGetRequestProperty, handleGetProperty, handleGetPropertyPriorityLocation } = require("../../controllers/property/controller.property");
const { checkAgentPropertyLimitation } = require("../../middlewares/property/middleware.property");

const {UploadImage} = require("../../middlewares/middleware.uploadFile.js");
const { checkAgentIsVerified } = require("../../middlewares/user/user.middleware.js");
const {upload} = new UploadImage("uploads/users/agent/images",2*1024*1024);
// const uploadIdentification = new UploadImage("uploads/users/agent/identification",2*1024*1024).upload.single("identification_image");
// const uploadProfile = new UploadImage("uploads/users/agent/profile",2*1024*1024).upload.single("profile_image");



const router  = express.Router();



const agentUpload = upload.fields([
    {name:'profile_image',maxCount:1},
    {name:'identification_image',maxCount:1}
])
router.get("/",agentVerifyToken,handleGetAgent);
router.post("/register",agentUpload,handleAgentRegistration);
router.post("/login",checkAgentIsVerified,handleAgentLogin);
router.post("/forgetPassword",handleAgentPasswordReset);
router.post("/rating",handleAgentRating)


router.get("/isLoggedIn",agentVerifyToken,handleGetAgentIsLoggedIn)

router.put("/updateProfile",agentVerifyToken,handleUpdateAgentProfile);
router.put("/updatePassword",agentVerifyToken,handleUpdateAgentPassword);


// property agent
router.get("/property",agentVerifyToken,handleGetPropertyPriorityLocation)

router.post("/property/house",agentVerifyToken,checkAgentPropertyLimitation,handleAddHouse);
router.get("/property/house",agentVerifyToken,handleGetHouse);

router.post("/property/land",agentVerifyToken,checkAgentPropertyLimitation,handleAddLand)
router.get("/property/land",agentVerifyToken,handleGetLand);

router.post("/property/apartment",agentVerifyToken,checkAgentPropertyLimitation,handleAddApartment);
router.get("/property/apartment",agentVerifyToken,handleGetAgent);


//property count
router.get("/property/count",agentVerifyToken,handleCountLisitingProperty)


// property request
router.post("/property/request",agentVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",agentVerifyToken,handleGetRequestProperty)




module.exports = router;