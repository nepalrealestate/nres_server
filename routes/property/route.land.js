const express = require("express");
const router = express.Router();
const {handleAddLand, handleGetLand, handleLandFeedback} = require("../../controllers/property/controller.land");

router.post("/",handleAddLand);
router.get("/",handleGetLand);
router.post("/feedback",handleLandFeedback);

module.exports = router;