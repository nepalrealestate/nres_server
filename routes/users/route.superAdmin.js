
const express = require("express");

const {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin} = require('../../controllers/users/superAdmin');
const { handleGetCustomerChatList } = require("../../controllers/chat/controller.userChat");

const router = express.Router();



router.get("/",handleGetSuperAdmin);
router.post("/register",handleSuperAdminRegistration)
router.post("/login",handleSuperAdminLogin)


router.get("chat/userChatList",handleGetCustomerChatList);

module.exports  = router;