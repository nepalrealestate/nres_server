function userAccountModel(sequelize,DataTypes){
    return UserAccount = sequelize.define("user_userAccount",{
        user_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_type:{
           type:DataTypes.ENUM('customer','agent') 
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
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
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
    userAccountModel,
}