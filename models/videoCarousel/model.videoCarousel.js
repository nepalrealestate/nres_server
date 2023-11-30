

function videoCarouselModel(sequelize,DataTypes){
    return VideoCarousel = sequelize.define('videoCarousel',{
        link:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        }
    },{freezeTableName:true})
}


module.exports = {videoCarouselModel};