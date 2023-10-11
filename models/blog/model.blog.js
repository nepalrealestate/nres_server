


function blogModel(sequelize, DataTypes) {
    return  Blog = sequelize.define('blog', {
        blog_id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        body:{
            type:DataTypes.TEXT,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        image: DataTypes.STRING,
    }, {
       freezeTableName:true
    })

    
}

module.exports = {blogModel}