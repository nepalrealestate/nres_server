const express = require("express");
const { handleRegisterServiceProvider, handleVerifyServiceProvider, handleGetPendingServiceProvider, handleGetServiceProvider } = require("../../controllers/nres_services/controller.nres_service");
const logger = require("../../utils/errorLogging/logger");

const router = express.Router();




router.get("/",function (req,res){
    //logger.info("Image Path Gets ",req.params.imagePath);
    logger.info(path.join(__dirname, 'uploads','property','house', 'images', 'image-1694506677143-669558468'))
    res.status(200).sendFile(path.join(__dirname, 'uploads','property','house', 'images', 'image-1694506677143-669558468'));
    //res.status(200).json({message:"Welcome to service page "})
})

router.post("/registerProvider",handleRegisterServiceProvider);

router.get("/getProvider",handleGetServiceProvider);

router.put("/provider/:status/:provider_id",handleVerifyServiceProvider);

router.get("/getPendingProvider/",handleGetPendingServiceProvider);

router.get("/images/:imagePath",(req,res)=>{
    logger.info("Image Path Gets ",req.params.imagePath);
    logger.info(path.join(__dirname, 'uploads','property','house', 'images', imagePath))
    res.sendFile(path.join(__dirname, 'uploads','property','house', 'images', imagePath));
})

module.exports = router;