const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset } = require("../../controllers/users/controller.agent");

const router  = express.Router();


router.get("/",handleGetAgent);
router.post("/register",handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/password",handleAgentPasswordReset);

module.exports = router;