
function contactModel(sequelize,DataTypes){
    return Contact = sequelize.define('contact',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
        },
        phoneNumber:{
            type:DataTypes.STRING,
            allowNull:false
        },
        message:{
            type:DataTypes.TEXT,
            allowNull:false
        },   
    },{
        freezeTableName:true,
    })
}



module.exports = {contactModel};