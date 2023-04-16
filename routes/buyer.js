
const express = require("express");
const router  = express.Router();
const {handleBuyers, handleRegistration, handleLogin}  = require('../controllers/buyer')

//specific router middleware for buyer

router.get("/",(req,res,next)=>{
    console.log(req.body);
    console.log("Buyer Api Hitt!!!!")
})

router.get("/",handleBuyers);
router.post("/registration",handleRegistration);
router.post("/login",handleLogin);


module.exports  = router;