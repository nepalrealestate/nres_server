const express = require("express");

const {handleGetStaff, handleStaffRegistration, handleStaffLogin} = require('../../controllers/users/staff');


const router  = express.Router();

router.get("/",handleGetStaff);
router.post("/register",handleStaffRegistration);
router.post("/login",handleStaffLogin);

module.exports = router;