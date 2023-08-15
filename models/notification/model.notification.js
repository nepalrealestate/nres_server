
function notificationModel(sequelize,DataTypes){
    
    return NotifyAdmin = sequelize.define('notification',{
        notification:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        url:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        }
    },{
        freezeTableName:true
    })

}



module.exports = {notificationModel}