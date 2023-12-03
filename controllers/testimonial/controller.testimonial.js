const { insertTestimonial, getTestimonial, getTestimonialById, deleteTestimonial } = require("../../models/services/testimonial/service.testimonial");
const { handleErrorResponse } = require("../controller.utils");

const handleInsertTestimonial = async (req, res) => {
    try {
        const {name,testimonial} = req.body;
        const response = await insertTestimonial({name,testimonial});
        return res.status(200).json({
            message: "Testimonial inserted successfully",
        })
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleGetTestimonial = async (req, res) => {
    try {
        const response = await getTestimonial();
        return res.status(200).json(response)
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleGetTestimonialByID = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await getTestimonialById(id);
        return res.status(200).json(response)
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleDeleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await deleteTestimonial(id);
        return res.status(200).json({
            message: "Testimonial deleted successfully",
        })
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

module.exports = {
    handleInsertTestimonial,
    handleGetTestimonial,
    handleGetTestimonialByID,
    handleDeleteTestimonial
}