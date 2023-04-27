const express = require("express");
const router = express.Router();
const {handleAddHouse,handleGetHouse} = require("../../controllers/property/controller.house");

router.post("/",handleAddHouse);
router.get("/",handleGetHouse);



module.exports = router;