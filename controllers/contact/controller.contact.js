const { createContact, getContact, getContactById, deleteContact } = require("../../models/services/contact/service.contact");
const { handleErrorResponse, handleLimitOffset } = require("../controller.utils");


const handleInsertContact = async (req, res) => {
    try {
        const { name, email, phoneNumber, message } = req.body;
        if (!name  || !phoneNumber || !message) {
            res.status(400).json({ message: "All fields are required" });
        } 
        const contact = await createContact({ name, email, phoneNumber, message });
        res.status(200).json({ message: "Contact created successfully" });
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleGetContact = async (req, res) => {
    const [limit,offset] = handleLimitOffset(req)
    try {
        const contact = await getContact();
        res.status(200).json(contact);
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleGetContactByID = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        res.status(200).json(contact);
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleDeleteContact = async(req,res)=>{
    try {
        const {id} = req.params;
        const contact = await deleteContact(id);
        res.status(200).json({message:"Contact deleted successfully"});
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

module.exports = { handleInsertContact, handleGetContact, handleGetContactByID, handleDeleteContact }