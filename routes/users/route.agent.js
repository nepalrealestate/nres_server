const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating, handleUpdateProfile, handleUpdateAgentProfile, handleUpdateAgentPassword, agentVerifyToken, handleGetAgentIsLoggedIn } = require("../../controllers/users/controller.agent");

const { handleAddApartment, handleGetApartment } = require("../../controllers/property/controller.apartment");
const { handleGetHouse, handleAddHouse } = require("../../controllers/property/controller.house");
const { handleGetLand, handleAddLand } = require("../../controllers/property/controller.land");
const { handleCountLisitingProperty, handleInsertRequestedProperty, handleGetRequestProperty, handleGetProperty, handleGetPropertyPriorityLocation, handleInsertPropertyFieldVisitRequest, handleGetUserFieldVisitRequest, handleUpdateUserFieldVisitRequest, handleInsertPropertyFieldVisitRequestCommentByUser, handleGetPropertyFieldVisitOTP, handleGetPropertyFieldVisitRequestComment, handleMatchPropertyFieldVisitOTP, handleGetOwnerPropertyFieldVisitRequest, handleInsertOrDeleteFavouriteProperty, handleGetFavouriteProperty, handleIsPropertyFavourite, handleInsertHomeLoan, handleInsertPropertyMoreInfoRequest } = require("../../controllers/property/controller.property");
const { checkAgentPropertyLimitation, checkPropertyValid } = require("../../middlewares/property/middleware.property");

const {UploadImage} = require("../../middlewares/middleware.uploadFile.js");
const { checkAgentIsVerified } = require("../../middlewares/user/user.middleware.js");
const { handleInsertServiceProviderRequest } = require("../../controllers/nres_services/controller.nres_service.js");
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

// property
router.post("/property/house",agentVerifyToken,handleAddHouse);
router.get("/property/house",agentVerifyToken,handleGetHouse);

router.post("/property/land",agentVerifyToken,handleAddLand)
router.get("/property/land",agentVerifyToken,handleGetLand);

router.post("/property/apartment",agentVerifyToken,handleAddApartment);
router.get("/property/apartment",agentVerifyToken,handleGetApartment);
//property Count 
router.get("/property/count",agentVerifyToken,handleCountLisitingProperty)




// property request
router.post("/property/request",agentVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",agentVerifyToken,handleGetRequestProperty)


//agent rating
router.post("/rating",agentVerifyToken,handleAgentRating)







// property field visit Request - 
router.post("/property/field-visit-request",agentVerifyToken,checkPropertyValid,handleInsertPropertyFieldVisitRequest)
router.get("/property/field-visit-request",agentVerifyToken,handleGetUserFieldVisitRequest)
router.patch("/property/field-visit-request/:visit_id",agentVerifyToken,handleUpdateUserFieldVisitRequest)
router.post("/property/field-visit-request/comment/:visit_id",agentVerifyToken,handleInsertPropertyFieldVisitRequestCommentByUser)
router.get("/property/field-visit-request/comment:visit_id",agentVerifyToken,handleGetPropertyFieldVisitRequestComment)
//match field visit request - enter otp
router.patch("/property/owner/field-visit-request/match/:visit_id",agentVerifyToken,handleMatchPropertyFieldVisitOTP)
// own property field visit request
router.get("/property/owner/field-visit-request",agentVerifyToken,handleGetOwnerPropertyFieldVisitRequest)
// get property field visit request comment by user for owner
router.get("/property/owner/field-visit-request/comment/:visit_id",agentVerifyToken,handleGetPropertyFieldVisitRequestComment)

//todo this

//user property field visit requested property
// user property field visit status - visited, not visited, pending
// user property field visit data
// user property field visit Response 
// user property field visit request negotiation
// user property field visit request agreement


//favourite Property
// router.post("/property/house/favourite/:property_id",agentVerifyToken,handleInsertHouseFavourite)
// router.post("/property/apartment/favourite/:property_id",agentVerifyToken,handleInsertApartmentFavourite)
// router.post("/property/land/favourite/:property_id",agentVerifyToken,handleInsertLandFavourite)

// router.delete("/property/house/favourite/:property_id",agentVerifyToken,handleDeleteHouseFavourite)
// router.delete("/property/apartment/favourite/:property_id",agentVerifyToken,handleDeleteApartmentFavourite)
// router.delete("/property/land/favourite/:property_id",agentVerifyToken,handleDeleteLandFavourite);

router.post("/property/favourite/:property_id",agentVerifyToken,checkPropertyValid,handleInsertOrDeleteFavouriteProperty)
router.get("/property/favourite",agentVerifyToken,handleGetFavouriteProperty)
router.get("/property/:property_type/isFavourite/:property_id",agentVerifyToken,checkPropertyValid,handleIsPropertyFavourite)


// if favourite property exits then delete if not then create - todo


// post user home loan request
router.post("/homeLoan",agentVerifyToken,checkPropertyValid,handleInsertHomeLoan);


// post property more info request
router.post("/property/more-info-request/:property_type/:property_id",agentVerifyToken,checkPropertyValid,handleInsertPropertyMoreInfoRequest)

// get service provider request
router.post("/serviceProvider/request/:provider_id",agentVerifyToken,handleInsertServiceProviderRequest)




module.exports = router;