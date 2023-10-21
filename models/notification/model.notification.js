
function notificationModel(sequelize,DataTypes){
    return NotifyAdmin = sequelize.define('notification',{
        
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        user_type:{
            type:DataTypes.ENUM("customer","agent","staff","superAdmin"),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
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
        },
        seen:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    },{
        freezeTableName:true
    })
}


module.exports = {notificationModel}