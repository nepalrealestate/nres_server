const express = require("express");

const { handleRequestProperty } = require("../../controllers/property/controller.property");

const router = express.Router();


router.post("/requestProperty",handleRequestProperty);


//router.get("/",)


module.exports = router;
