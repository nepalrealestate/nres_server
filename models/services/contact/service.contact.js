const db = require("../../model.index");
const Contact = db.contact;

async function createContact(contact) {
    return await Contact.create(contact);
}

async function getContactById(id) {
    return await Contact.findByPk(id);
}

async function getContact(){
    return await Contact.findAll({
        order: [
            ['createdAt', 'DESC'],
        ],
    });
}

async function deleteContact(id) {
    return await Contact.destroy({
        where: { id: id }
    });
}


module.exports = {createContact,getContactById,getContact,deleteContact}