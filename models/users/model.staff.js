const {pool}  = require("../../connection")




function staffModel (sequelize,DataTypes){
    return Staff = sequelize.define('user_staff',{
      staff_id :{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
        
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
      recruited_data:{
        type:DataTypes.DATEONLY
      },
      tenure:{
        type:DataTypes.STRING
      },
      salary:{
        type:DataTypes.DECIMAL(12,2),
        allowNull:false
      },
      qualification:{
        type:DataTypes.STRING
      },
      pan_no:{
        type:DataTypes.STRING
      },
      document:{
        type:DataTypes.JSON
      },
      password:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
          notEmpty: true  
      }
    }
    },{
      freezeTableName:true
    })
  }






module.exports = {staffModel}
