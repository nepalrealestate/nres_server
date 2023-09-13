const express = require("express");

const router = express.Router();

router("/",(req,res)=>{
    return res.status(200).json({message:"I am jus testing"})
})

module.exports = router;