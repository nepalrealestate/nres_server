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
        freezeTableName:true,
        hooks: {
          afterCreate: async (user, options) => {
            // Check user_type and create corresponding profile
            if (user.user_type === 'customer') {
              await sequelize.models.user_customerProfile.create({ user_id: user.user_id });
            } else if (user.user_type === 'agent') {
              await sequelize.models.user_agentProfile.create({ user_id: user.user_id });
            }
          },
        }
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
    },
    property_limit:{
      type:DataTypes.INTEGER,
      defaultValue:3
    },
  },{
    freezeTableName:true
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
      notEmpty:true
    },
    identification_number:{
      type:DataTypes.STRING,
      unique:true,
      
    },
    identification_image:{
      type:DataTypes.STRING,
   
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
    },

    verified:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    verified_by:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_adminAccount',
        key:'admin_id'
      }
    },
    
  },{
    freezeTableName:true
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