const express = require("express");

const router = express.Router();

router.post("/",(req,res)=>res.status(200).json({message:"Welcome to service page "}))




module.exports = router;