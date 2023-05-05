const express = require("express");
const router = express.Router();
const {handleAddLand, handleGetLand, handleLandFeedback, handleUpdateLandViews} = require("../../controllers/property/controller.land");


router.post("/",handleAddLand); // add land property
router.get("/",handleGetLand); // get all land details
router.post("/feedback",handleLandFeedback); // add land response/feedback
router.put("/updateViews/:property_ID",handleUpdateLandViews);// update land views

module.exports = router;