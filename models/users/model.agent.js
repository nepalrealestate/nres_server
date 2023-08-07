
// --- sequlize
function agentModel (sequelize,DataTypes){
  return Agent = sequelize.define('user_agent',{
    agent_id :{
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
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
          isEmail:true,
          notEmpty:true
      }
    },
    phone_number:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
      notEmpty:true
    }
    },
    identification_type:{
      type:DataTypes.STRING
    },
    identification_number:{
      type:DataTypes.STRING
    },
    image:{
      type:DataTypes.JSON
    },
    password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate: {
        notEmpty: true  
    }
    },
    status:{
      type:DataTypes.ENUM('pending','approved','rejected'),
      defaultValue:'pending'
    },
  

   
  }
  ,{
    freezeTableName: true,
  })
}


function agentRatingModel(sequelize,DataTypes){
  return AgentRating = sequelize.define('user_agent_rating',{
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
        model:'user_customer',
        key:'customer_id'
      }
    },
    agent_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_agent',
        key:'agent_id'
      }
    }
  },{
    freezeTableName:true
  })
}


function agentInfoModel(sequelize,DataTypes){
  return AgentInfo =sequelize.define('user_agent_info',{
    agent_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      references:{
        model:'user_agent',
        key:'agent_id'
      }
    },
    averageRating:{
      type:DataTypes.FLOAT,
      default:0
    },
    totalRating:{
      type:DataTypes.INTEGER,
      default:0
    },
    totalListedProperty:{
      type:DataTypes.INTEGER,
      default:0
    }
  },{
    freezeTableName:true
  })
}




module.exports = {agentModel,agentRatingModel,agentInfoModel};
