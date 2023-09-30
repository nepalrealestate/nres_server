const express = require("express");
const { handleInsertAgentRating } = require("../../controllers/users/controller.agent");
const { handleCustomerRegistration, handleCustomerLogin, handleGetCustomer, customerVerifyToken } = require("../../controllers/users/controller.customer");
const { handleAddHouse, handleGetHouse } = require("../../controllers/property/controller.house");
const { handleCountLisitingProperty } = require("../../controllers/property/controller.property");

const router = express.Router();


//router.post("/register");

router.post("/register",handleCustomerRegistration)
router.post("/login",handleCustomerLogin); 
router.get("/",customerVerifyToken,handleGetCustomer)

// test this route
router.post("/agentRating",customerVerifyToken,handleInsertAgentRating);


// property
router.post("/property/house",customerVerifyToken,handleAddHouse);
router.get("/property/house",customerVerifyToken,handleGetHouse)


//property Count 
router.get("/property/count",customerVerifyToken,handleCountLisitingProperty)





module.exports = router;