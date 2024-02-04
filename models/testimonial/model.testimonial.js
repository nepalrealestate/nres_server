function testimonialModel(sequelize,DataTypes){
    return testimonial = sequelize.define('testimonial',{
        testimonial: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating:{
            type:DataTypes.STRING
        }
    },{
        freezeTableName: true,
    } )
}


module.exports = {testimonialModel};