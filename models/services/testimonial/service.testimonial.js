const db = require("../../model.index");
const Testimonial = db.TestimonialModel;


async function insertTestimonial(data) {
    return await Testimonial.create(data);
}

async function getTestimonial(){
    return await Testimonial.findAll();
}

async function getTestimonialById(id){
    return await Testimonial.findByPk(id);
}

async function deleteTestimonial(id){
    return await Testimonial.destroy({
        where: { id: id }
    });
}


module.exports = {
    insertTestimonial,
    getTestimonial,
    getTestimonialById,
    deleteTestimonial
}