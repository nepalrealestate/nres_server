const express = require("express");
const router = express.Router();
const {handleAddLand, handleGetLand, handleLandFeedback, handleUpdateLandViews, handleGetLandByID} = require("../../controllers/property/controller.land");


router.post("/",handleAddLand); // add land property
router.get("/",handleGetLand); // get all land details
router.post("/feedback",handleLandFeedback); // add land response/feedback
router.put("/updateViews/:property_ID",handleUpdateLandViews);// update land views
router.get("/:property_ID",handleGetLandByID);// get single Land and also update views


module.exports = router;