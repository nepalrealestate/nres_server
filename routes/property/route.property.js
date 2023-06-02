const express = require("express");

const { handleRequestProperty, hanldeGetProperty } = require("../../controllers/property/controller.property");

const router = express.Router();


router.post("/requestProperty",handleRequestProperty);


router.get("/",hanldeGetProperty)


module.exports = router;
