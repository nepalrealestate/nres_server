const express = require("express");
const { handleRegisterServiceProvider } = require("../../controllers/services/controller.service");

const router = express.Router();

router.get("/",(req,res)=>res.status(200).json({message:"Welcome to service page "}))

router.post("/registerProvider",handleRegisterServiceProvider);



module.exports = router;