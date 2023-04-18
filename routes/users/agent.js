const express = require("express");
const { handleRegistration,handleGetAgent,handleLogin } = require("../../controllers/users/agent");

const router  = express.Router();


router.get("/",handleGetAgent);
router.post("/register",handleRegistration);
router.post("/login",handleLogin)

module.exports = router;