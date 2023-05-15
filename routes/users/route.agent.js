const express = require("express");
const { handleAgentRegistration,handleGetAgent,handleAgentLogin, handleAgentPasswordReset } = require("../../controllers/users/controller.agent");

const router  = express.Router();

const {UploadImage} = require("../../middlewares/middleware.uploadFile");
const path  = 'uploads/users/agent/'  //path from source 
const uploadAgentImage = new UploadImage(path);

router.get("/",handleGetAgent);
router.post("/register",uploadAgentImage.upload.array('image',2),handleAgentRegistration);
router.post("/login",handleAgentLogin);
router.put("/password",handleAgentPasswordReset);

module.exports = router;