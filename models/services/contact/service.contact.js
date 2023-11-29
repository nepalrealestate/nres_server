const db = require("../../model.index");
const Contact = db.ContactModel.Contact;

async function createContact(contact) {
    return await Contact.create(contact);
}

async function getContactById(id) {
    return await Contact.findByPk(id);
}

async function getContact(limit,offset){
    return await Contact.findAll({
        order: [
            ['createdAt', 'DESC'],
        ],
        limit:limit,
        offset:offset
    });
}

async function deleteContact(id) {
    return await Contact.destroy({
        where: { id: id }
    });
}


module.exports = {createContact,getContactById,getContact,deleteContact}