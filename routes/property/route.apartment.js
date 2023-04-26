const express = require("express");
const router = express.Router();
const {handleAddApartment} = require("../../controllers/property/controller.apartment");

router.post("/",handleAddApartment);



module.exports = router;