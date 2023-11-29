const { handleInsertContact } = require("../../controllers/contact/controller.contact");

const router = require("express").Router();

router.post("/",handleInsertContact)


module.exports = router;