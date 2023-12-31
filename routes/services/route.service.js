const express = require("express");
const { handleRegisterServiceProvider, handleVerifyServiceProvider, handleGetServiceProvider } = require("../../controllers/nres_services/controller.nres_service");
const logger = require("../../utils/errorLogging/logger");
const path  = require('path')

const router = express.Router();



router.post("/registerProvider",handleRegisterServiceProvider);

router.get("/getProvider",handleGetServiceProvider);






module.exports = router;