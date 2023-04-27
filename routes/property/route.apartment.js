const express = require("express");
const router = express.Router();
const {handleAddApartment, handleGetApartment} = require("../../controllers/property/controller.apartment");

router.post("/",handleAddApartment);
router.get("/",handleGetApartment);


module.exports = router;