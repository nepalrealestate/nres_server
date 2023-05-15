
const express = require("express");
const router  = express.Router();
const {handleBuyers, handleBuyerRegistration, handleBuyerLogin, handleBuyerFavouriteProperty}  = require('../../controllers/users/controller.buyer')

//specific router middleware for buyer

router.get("/",(req,res,next)=>{
    console.log(req.body);
    console.log("Buyer Api Hitt!!!!")
})

router.get("/",handleBuyers);
router.post("/register",handleBuyerRegistration);
router.post("/login",handleBuyerLogin);
router.post("/addFavouriteProperty",handleBuyerFavouriteProperty);


module.exports  = router;