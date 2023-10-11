const express = require("express");
const { handleInsertAgentRating } = require("../../controllers/users/controller.agent");
const { handleCustomerRegistration, handleCustomerLogin, handleGetCustomer, customerVerifyToken, handleGetCustomerProfile } = require("../../controllers/users/controller.customer");
const { handleAddHouse, handleGetHouse, handleAddPendingHouse } = require("../../controllers/property/controller.house");
const { handleCountLisitingProperty, handleInsertRequestedProperty, handleGetRequestProperty, handleGetPropertyPriorityLocation } = require("../../controllers/property/controller.property");
const { handleAddLand, handleGetLand } = require("../../controllers/property/controller.land");
const { handleAddApartment, handleGetApartment } = require("../../controllers/property/controller.apartment");

const router = express.Router();


//router.post("/register");

router.post("/register",handleCustomerRegistration)
router.post("/login",handleCustomerLogin); 
router.get("/",customerVerifyToken,handleGetCustomerProfile)

// test this route
router.post("/agentRating",customerVerifyToken,handleInsertAgentRating);


router.get("/property",customerVerifyToken,handleGetPropertyPriorityLocation)

// property
router.post("/property/house",customerVerifyToken,handleAddPendingHouse);
router.get("/property/house",customerVerifyToken,handleGetHouse);

router.post("/property/land",customerVerifyToken,handleAddLand)
router.get("/property/land",customerVerifyToken,handleGetLand);

router.post("/property/apartment",customerVerifyToken,handleAddApartment);
router.get("/property/apartment",customerVerifyToken,handleGetApartment);
//property Count 
router.get("/property/count",customerVerifyToken,handleCountLisitingProperty)

//change password
router.patch("/password",customerVerifyToken,)



// property request
router.post("/property/request",customerVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",customerVerifyToken,handleGetRequestProperty)







module.exports = router;