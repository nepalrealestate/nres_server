const express = require("express");
const { handleRegisterServiceProvider, handleGetServieProvider, handleVerifyServiceProvider, handleGetPendingServiceProvider } = require("../../controllers/services/controller.service");

const router = express.Router();


const { UploadImage } = require("../../middlewares/middleware.uploadFile");

const imagePath = "uploads/users/agent/images";
const maxSixe = 2 * 1024 * 1024;
const upload = new UploadImage(imagePath, maxSixe).upload.single('image');


router.get("/",(req,res)=>res.status(200).json({message:"Welcome to service page "}))

router.post("/registerProvider",upload,handleRegisterServiceProvider);

router.get("/getProvider",handleGetServieProvider);

router.put("/provider/:status/:provider_id",handleVerifyServiceProvider);

router.get("/getPendingProvider/",handleGetPendingServiceProvider);

module.exports = router;