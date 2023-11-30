const db = require("../../model.index");
const { VideoCarousel } = db;
async function insertVideoCarouselLink(link){
    return await VideoCarousel.create({
        link:link
    });
}

async function getVideoCarouselLink(){
    return await VideoCarousel.findAll({
        order:[['createdAt','DESC']]
    });
}

async function deleteVideoCarouselLink(id){
    return await VideoCarousel.destroy({
        where:{
            id:id
        }
    })
}


module.exports = {
    insertVideoCarouselLink,
    getVideoCarouselLink,
    deleteVideoCarouselLink
}