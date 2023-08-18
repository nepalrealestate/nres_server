
const express = require("express");

const {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin} = require('../../controllers/users/controller.superAdmin');
const { handleGetCustomerChatList } = require("../../controllers/chat/controller.customerChat");
const { handleGetStaffChatList, handleInsertStaffGroup, handleDeleteStaffFromGroup } = require("../../controllers/chat/controller.staffChat");
const { handleStaffRegistration, handleGetAllStaff, handleStaffUpdate, handleStaffDelete, handleGetStaff } = require("../../controllers/users/controller.staff");

const router = express.Router();



router.get("/",handleGetSuperAdmin);
router.post("/register",handleSuperAdminRegistration)
router.post("/login",handleSuperAdminLogin)


// chat 
//router.post("chat/add")

router.get("/chat/customerList",handleGetCustomerChatList);
router.get("/chat/staffList",handleGetStaffChatList);
router.post("/chat/staffGroup/:staffID",handleInsertStaffGroup);
router.delete("/chat/staffGroup/:staffID",handleDeleteStaffFromGroup);


// agent chat
//router.get("/chat")


// staff related apis 
router.post("/register/staff",handleStaffRegistration);
router.get("/staff",handleGetAllStaff);
router.get("/staff/:staff_id",handleGetStaff)
router.put("/staff/:staff_id",handleStaffUpdate)
router.delete("/staff/:staff_id",handleStaffDelete);




module.exports  = router;