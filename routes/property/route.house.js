const express = require("express");
const router = express.Router();
const {handleAddHouse,handleGetHouse, handleHouseFeedback, handleGetHouseByID, handleInsertHomeLoan} = require("../../controllers/property/controller.house");
const { handleUpdateHouseViews } = require("../../controllers/property/controller.house");

router.post("/",handleAddHouse); // insert house property
router.get("/",handleGetHouse); // get all house property
router.post("/feedback",handleHouseFeedback); // insert house feedback
//router.put("/updateViews/:property_ID",handleUpdateHouseViews); // update house views
router.get("/:property_id",handleGetHouseByID); // get single house and update views also 


module.exports = router;