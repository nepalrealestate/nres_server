const express = require("express");
const router = express.Router();
const {handleAddHouse,handleGetHouse, handleHouseFeedback} = require("../../controllers/property/controller.house");

router.post("/",handleAddHouse);
router.get("/",handleGetHouse);
router.post("/feedback",handleHouseFeedback);



module.exports = router;