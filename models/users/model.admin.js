function adminAccountModel(sequelize,DataTypes){
    return AdminAccount = sequelize.define("user_adminAccount",{
        admin_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        admin_type:{
           type:DataTypes.ENUM('staff','superAdmin') 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true,
            },
          },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
              notEmpty: true,
            },
        },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true,
            },
          },

    },{
        freezeTableName:true
    })

}


module.exports = {
    adminAccountModel
}