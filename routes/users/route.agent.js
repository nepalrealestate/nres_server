const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset, handleAgentRating } = require("../../controllers/users/controller.agent");
const { verifyToken } = require("../../controllers/users/commonAuthCode");

const router  = express.Router();



router.get("/",verifyToken,handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/password",handleAgentPasswordReset);
router.post("/rating",handleAgentRating)

module.exports = router;