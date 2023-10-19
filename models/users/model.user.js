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



function customerProfileModel(sequelize,DataTypes){
  return CustomerProfile = sequelize.define("user_customerProfile",{
    user_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete: 'CASCADE'
    },
    profileImage:{
      type:DataTypes.STRING,
    },
    province:{
      type:DataTypes.STRING,
      validate:{
        notEmpty:true
      }
    },
    district:{
      type:DataTypes.STRING,
    },
    municipality:{
      type:DataTypes.STRING,
    },
    ward_number:{
      type:DataTypes.INTEGER,
    },
    area_name:{
      type:DataTypes.STRING
    }
    
    
  })
}

function agentProfileModel(sequelize,DataTypes){
  return AgentProfile = sequelize.define("user_agentProfile",{
    user_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete: 'CASCADE'
    },
    identification_type:{
      type:DataTypes.ENUM('citizenship','passport','driving_license'),
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    identification_number:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        notEmpty:true
      }
    },
    identification_image:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    profileImage:{
      type:DataTypes.STRING,
    },
    province:{
      type:DataTypes.STRING,
    },
    district:{
      type:DataTypes.STRING,
    },
    municipality:{
      type:DataTypes.STRING,
    },
    ward_number:{
      type:DataTypes.INTEGER,
    },
    area_name:{
      type:DataTypes.STRING
    }
    
  })
}


function agentRatingModel(sequelize,DataTypes){
  return AgentRating = sequelize.define("user_agentRating",{
    rating:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    review:{
      type:DataTypes.TEXT
    },
    customer_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_userAccount',
        key:'user_id'
      }
    },
    agent_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_userAccount',
        key:'user_id'
      }
    },
  },{
    freezeTableName:true
  })
}




module.exports = {
    userAccountModel,
    customerProfileModel,
    agentProfileModel,
    agentRatingModel 
}