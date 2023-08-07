const express = require("express");
const { handleInsertAgentRating } = require("../../controllers/users/controller.agent");
const { handleCustomerRegistration, handleCustomerLogin, handleGetCustomer, customerVerifyToken } = require("../../controllers/users/controller.customer");

const router = express.Router();


//router.post("/register");

router.post("/register",handleCustomerRegistration)
router.post("/login",handleCustomerLogin); 
router.get("/",customerVerifyToken,handleGetCustomer)

// test this route
router.post("/agentRating",customerVerifyToken,handleInsertAgentRating);




module.exports = router;