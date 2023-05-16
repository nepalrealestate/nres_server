const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset } = require("../../controllers/users/controller.agent");

const router  = express.Router();

const {UploadImage} = require("../../middlewares/middleware.uploadFile");
const path  = 'uploads/users/agent/'  //path from source 
const maxImageSize = 2 * 1024 * 1024
const uploadImage = new UploadImage(path,maxImageSize);


router.get("/",handleGetAgent);
router.post("/register",uploadImage.upload.array('image',2),handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/password",handleAgentPasswordReset);

module.exports = router;