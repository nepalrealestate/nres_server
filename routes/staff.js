const express = require("express");
const router  = express.Router();
const {handleStaff} = require('../controllers/staff');

router.get("/",handleStaff);

module.exports = router;