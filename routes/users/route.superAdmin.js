
const express = require("express");

const {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin} = require('../../controllers/users/controller.superAdmin');
const { handleGetCustomerChatList } = require("../../controllers/chat/controller.customerChat");
const { handleGetStaffChatList, handleInsertStaffGroup, handleDeleteStaffFromGroup } = require("../../controllers/chat/controller.staffChat");
const { handleStaffRegistration, handleGetAllStaff, handleStaffUpdate, handleStaffDelete, handleGetStaff } = require("../../controllers/users/controller.staff");
const { handleGetAllAgent } = require("../../controllers/users/controller.agent");
const { handleGetServiceProvider } = require("../../controllers/nres_services/controller.nres_service");
const { handleGetCustomer } = require("../../controllers/users/controller.customer");
const { handleAddApartment, handleGetApartment, handleInsertRequestedApartment, handleGetRequestedApartment } = require("../../controllers/property/controller.apartment");
const { handleAddHouse, handleGetHouse, handleInsertRequestedHouse, handleGetRequestedHouse } = require("../../controllers/property/controller.house");
const { handleAddLand, handleGetLand, handleInsertRequestedLand, handleGetRequestedLand } = require("../../controllers/property/controller.land");

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


// agent related routes
router.get("/agent",handleGetAllAgent);


//service provider related routes
router.get("/service/provider",handleGetServiceProvider)


//customer related routes
router.get("/customer/:customer_id",handleGetCustomer)


// property Related Routes
router.post("/property/apartment",handleAddApartment)
router.get("/property/apartment",handleGetApartment)

router.post("/property/house",handleAddHouse)
router.get("/property/house",handleGetHouse)

router.post("/property/land",handleAddLand)
router.get("/property/land",handleGetLand)


router.post("/property/apartment/request",handleInsertRequestedApartment)
router.get("/property/apartment/request",handleGetRequestedApartment)

router.post("/property/house/request",handleInsertRequestedHouse)
router.get("/property/house/request",handleGetRequestedHouse)

router.post("/property/land/request",handleInsertRequestedLand)
router.get("/property/land/request",handleGetRequestedLand)

module.exports  = router;