const express = require("express");
const { handleRegisterServiceProvider, handleGetServieProvider, handleVerifyServiceProvider, handleGetPendingServiceProvider } = require("../../controllers/nres_services/controller.nres_service");

const router = express.Router();




router.get("/",(req,res)=>res.status(200).json({message:"Welcome to service page "}))

router.post("/registerProvider",handleRegisterServiceProvider);

router.get("/getProvider",handleGetServieProvider);

router.put("/provider/:status/:provider_id",handleVerifyServiceProvider);

router.get("/getPendingProvider/",handleGetPendingServiceProvider);

module.exports = router;