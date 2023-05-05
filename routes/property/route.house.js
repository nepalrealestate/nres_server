const express = require("express");
const router = express.Router();
const {handleAddHouse,handleGetHouse, handleHouseFeedback} = require("../../controllers/property/controller.house");
const { handleUpdateHouseViews } = require("../../controllers/property/controller.house");

router.post("/",handleAddHouse);
router.get("/",handleGetHouse);
router.post("/feedback",handleHouseFeedback);
router.put("/updateViews/:property_ID",handleUpdateHouseViews);



module.exports = router;