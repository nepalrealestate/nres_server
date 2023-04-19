
const express = require("express");
const router  = express.Router();
const {handleBuyers, handleBuyerRegistration, handleBuyerLogin}  = require('../../controllers/users/buyer')

//specific router middleware for buyer

router.get("/",(req,res,next)=>{
    console.log(req.body);
    console.log("Buyer Api Hitt!!!!")
})

router.get("/",handleBuyers);
router.post("/registration",handleBuyerRegistration);
router.post("/login",handleBuyerLogin);


module.exports  = router;