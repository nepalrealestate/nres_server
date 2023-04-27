const express = require("express");
const router = express.Router();
const {handleAddLand, handleGetLand} = require("../../controllers/property/controller.land");

router.post("/",handleAddLand);
router.get("/",handleGetLand);


module.exports = router;