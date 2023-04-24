const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin } = require("../../controllers/users/agent");

const router  = express.Router();


router.get("/",handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);


module.exports = router;