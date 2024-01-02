const express = require("express");
const { handleInsertAgentRating, handleAgentRating } = require("../../controllers/users/controller.agent");
const { handleCustomerRegistration, handleCustomerLogin, handleGetCustomer, customerVerifyToken, handleGetCustomerProfile, handleCustomerPasswordReset, handleGetCustomerIsLoggedIn, customerLogout, handleUpdateCustomerProfile, handleUpdateCustomerPassword } = require("../../controllers/users/controller.customer");
const { handleAddHouse, handleGetHouse, handleInsertHouseFavourite, handleDeleteHouseFavourite } = require("../../controllers/property/controller.house");
const { handleCountLisitingProperty, handleInsertRequestedProperty, handleGetRequestProperty, handleGetPropertyPriorityLocation, handleInsertPropertyFieldVisitRequest, handleGetFavouriteProperty } = require("../../controllers/property/controller.property");
const { handleAddLand, handleGetLand, handleInsertLandFavourite, handleDeleteLandFavourite } = require("../../controllers/property/controller.land");
const { handleAddApartment, handleGetApartment, handleInsertApartmentFavourite, handleDeleteApartmentFavourite } = require("../../controllers/property/controller.apartment");
const { handleGetSingleCustomerChat } = require("../../controllers/chat/controller.customerChat");
const { checkCustomerPropertyLimitation } = require("../../middlewares/property/middleware.property");
const { googleSignInVerify } = require("../../middlewares/middleware.auth");


const router = express.Router();


//router.post("/register");

router.post("/register",handleCustomerRegistration)
router.post("/login",googleSignInVerify,handleCustomerLogin); 
router.get("/",customerVerifyToken,handleGetCustomerProfile)
router.post("/forgetPassword",handleCustomerPasswordReset)
router.post("/logout",customerLogout);

router.patch("/profile",customerVerifyToken,handleUpdateCustomerProfile);

//change password
router.patch("/password",customerVerifyToken,handleUpdateCustomerPassword)




router.get("/isLoggedIn",customerVerifyToken,handleGetCustomerIsLoggedIn)

// test this route
router.post("/agentRating",customerVerifyToken,handleInsertAgentRating);


router.get("/property",customerVerifyToken,handleGetPropertyPriorityLocation)

// property
router.post("/property/house",customerVerifyToken,checkCustomerPropertyLimitation,handleAddHouse);
router.get("/property/house",customerVerifyToken,handleGetHouse);

router.post("/property/land",customerVerifyToken,checkCustomerPropertyLimitation,handleAddLand)
router.get("/property/land",customerVerifyToken,handleGetLand);

router.post("/property/apartment",customerVerifyToken,checkCustomerPropertyLimitation,handleAddApartment);
router.get("/property/apartment",customerVerifyToken,handleGetApartment);
//property Count 
router.get("/property/count",customerVerifyToken,handleCountLisitingProperty)




// property request
router.post("/property/request",customerVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",customerVerifyToken,handleGetRequestProperty)


//agent rating
router.post("/rating",customerVerifyToken,handleAgentRating)




// chat
router.get("/previousChat",customerVerifyToken,handleGetSingleCustomerChat)



// property field visit Request - 
router.post("/property/fieldVisit",customerVerifyToken,handleInsertPropertyFieldVisitRequest)


//favourite Property
router.post("/property/house/favourite/:property_id",customerVerifyToken,handleInsertHouseFavourite)
router.post("/property/apartment/favourite/:property_id",customerVerifyToken,handleInsertApartmentFavourite)
router.post("/property/land/favourite/:property_id",customerVerifyToken,handleInsertLandFavourite)

router.delete("/property/house/favourite/:property_id",customerVerifyToken,handleDeleteHouseFavourite)
router.delete("/property/apartment/favourite/:property_id",customerVerifyToken,handleDeleteApartmentFavourite)
router.delete("/property/land/favourite/:property_id",customerVerifyToken,handleDeleteLandFavourite);

// get favourite property 
router.get("/property/favourite",customerVerifyToken,handleGetFavouriteProperty)




module.exports = router;