
function adsModel(sequelize,DataTypes){
    return Ads = sequelize.define('ads_video',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        link:{
            type:DataTypes.STRING,
            allowNull:false
        },
    },{
        freezeTableName:true
    })
}

module.exports = {adsModel}