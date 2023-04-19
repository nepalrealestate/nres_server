const express = require("express");
const { handleRentalRegistration,handleGetRental, handleRentalLogin } = require("../../controllers/users/rental");



const router = express.Router();

router.get("/",handleGetRental);
router.post("/register",handleRentalRegistration)
router.post("/login",handleRentalLogin)


module.exports  = router;