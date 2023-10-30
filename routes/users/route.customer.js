const express = require("express");
const { handleInsertAgentRating, handleAgentRating } = require("../../controllers/users/controller.agent");
const { handleCustomerRegistration, handleCustomerLogin, handleGetCustomer, customerVerifyToken, handleGetCustomerProfile, handleCustomerPasswordReset } = require("../../controllers/users/controller.customer");
const { handleAddHouse, handleGetHouse, handleAddPendingHouse } = require("../../controllers/property/controller.house");
const { handleCountLisitingProperty, handleInsertRequestedProperty, handleGetRequestProperty, handleGetPropertyPriorityLocation } = require("../../controllers/property/controller.property");
const { handleAddLand, handleGetLand, handleAddPendingLand } = require("../../controllers/property/controller.land");
const { handleAddApartment, handleGetApartment, handleAddPendingApartment } = require("../../controllers/property/controller.apartment");
const { handleGetSingleCustomerChat } = require("../../controllers/chat/controller.customerChat");


const router = express.Router();


//router.post("/register");

router.post("/register",handleCustomerRegistration)
router.post("/login",handleCustomerLogin); 
router.get("/",customerVerifyToken,handleGetCustomerProfile)
router.post("/forgetPassword",handleCustomerPasswordReset)

router.get("/isLoggedIn",customerVerifyToken,async (req, res) => {
    return res
      .status(200)
      .json({ message: "Customer Logged In", user_id: req.id, role: "customer" });
  })

// test this route
router.post("/agentRating",customerVerifyToken,handleInsertAgentRating);


router.get("/property",customerVerifyToken,handleGetPropertyPriorityLocation)

// property
router.post("/property/house",customerVerifyToken,handleAddPendingHouse);
router.get("/property/house",customerVerifyToken,handleGetHouse);

router.post("/property/land",customerVerifyToken,handleAddPendingLand)
router.get("/property/land",customerVerifyToken,handleGetLand);

router.post("/property/apartment",customerVerifyToken,handleAddPendingApartment);
router.get("/property/apartment",customerVerifyToken,handleGetApartment);
//property Count 
router.get("/property/count",customerVerifyToken,handleCountLisitingProperty)

//change password
router.patch("/password",customerVerifyToken,)



// property request
router.post("/property/request",customerVerifyToken,handleInsertRequestedProperty)
router.get("/property/request",customerVerifyToken,handleGetRequestProperty)


//agent rating
router.post("/rating",customerVerifyToken,handleAgentRating)




// chat
router.get("/previousChat",customerVerifyToken,handleGetSingleCustomerChat)







module.exports = router;