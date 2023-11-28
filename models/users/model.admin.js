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

function staffProfileModel (sequelize,DataTypes){
  return Staff = sequelize.define('user_admin_staff_profile',{
    staff_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
    },
    admin_id:{
      type:DataTypes.INTEGER, 
      references:{
        model:'user_adminAccount',
        key:'admin_id'
      },
      onDelete: 'SET NULL'
      
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    gender:{
      type:DataTypes.ENUM('male','female','other')
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
          isEmail:true,
          notEmpty:true
      }
    },
    address:{
      type:DataTypes.STRING
    },
    contact:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    responsibility:{
      type:DataTypes.STRING
    },
    date_of_birth:{
      type:DataTypes.DATEONLY,
    },
    recruited_date:{
      type:DataTypes.DATEONLY
    },
    tenure:{
      type:DataTypes.STRING
    },
    salary:{
      type:DataTypes.STRING,
  
    },
    qualification:{
      type:DataTypes.STRING
    },
    pan_no:{
      type:DataTypes.STRING
    },
    documents:{
      type:DataTypes.JSON
    },
    isActive:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
    }
  },{
    freezeTableName:true
  })
}

module.exports = {
    adminAccountModel,
    staffProfileModel
}