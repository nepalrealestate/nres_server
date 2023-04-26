const express = require("express");
const router = express.Router();
const {handleAddHouse} = require("../../controllers/property/controller.house");

router.post("/",handleAddHouse);



module.exports = router;