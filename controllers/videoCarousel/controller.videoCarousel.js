const { insertVideoCarouselLink, getVideoCarouselLink, deleteVideoCarouselLink } = require("../../models/services/videoCarousel/service.videoCarousel");
const { handleErrorResponse } = require("../controller.utils");

const handleInsertVideoCarousel = async (req, res) => {
    try{
        const {link} = req.body;
        const response = await insertVideoCarouselLink(link);
        return res.status(200).json({
            success:true,
            message:"Video Carousel Link Inserted Successfully",
            data:response
        })
    }catch(error){
        handleErrorResponse(res,error)
    }
}

const handleGetVideoCarousel = async (req, res) => {
    try{
        const response = await getVideoCarouselLink();
        return res.status(200).json(response)
    }catch(error){
        handleErrorResponse(res,error)
    }
}


const handleDeleteVideoCarousel = async (req, res) => {
    const {id} = req.params;
    try {
        const response = await deleteVideoCarouselLink(id);
        return res.status(200).json({
            success:true,
            message:"Video Carousel Link Deleted Successfully"
        })
    } catch (error) {
        handleErrorResponse(res,error)
    }
}


module.exports = {
    handleInsertVideoCarousel,
    handleGetVideoCarousel,
    handleDeleteVideoCarousel
}