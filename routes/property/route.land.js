const express = require("express");
const router = express.Router();
const {handleAddLand} = require("../../controllers/property/controller.land");

router.post("/",handleAddLand);



module.exports = router;