
const {handleGetSeller, handleSellerRegistration, handleSellerLogin} = require("../../controllers/users/seller");

const express = require("express");

const router = express.Router();

router.get("/",handleGetSeller);
router.post("/register",handleSellerRegistration);
router.post("/login",handleSellerLogin)


module.exports = router;