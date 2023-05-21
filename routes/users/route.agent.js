const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating } = require("../../controllers/users/controller.agent");
const { verifyToken } = require("../../controllers/users/commonAuthCode");
const { handleAddApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse } = require("../../controllers/property/controller.house");
const { handleAddLand } = require("../../controllers/property/controller.land");

const router  = express.Router();



router.get("/",verifyToken,handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/password",handleAgentPasswordReset);
router.post("/rating",handleAgentRating)

// testing code

router.post("/addApartment",verifyToken,handleAddApartment);
router.post("/addHouse",verifyToken,handleAddHouse);
router.post("/addLand",verifyToken,handleAddLand)

module.exports = router;