
function serviceProviderModel(sequelize,DataTypes){
  return ServiceProvider = sequelize.define('service_provider',{
    id:{
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
      unique:true,
    },
    phone_number:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
      notEmpty:true
      },
    },
    gender:{
      type:DataTypes.STRING
    },
    age:{
      type:DataTypes.INTEGER
    },
    service_type:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    province:{
      type:DataTypes.STRING,
    },
    district:{
      type:DataTypes.STRING
    },
    municipality:{      
      type:DataTypes.STRING
    },
    ward_number:{
      type:DataTypes.INTEGER
    },
    profileImage:{
      type:DataTypes.STRING
    },
    status:{
      type:DataTypes.ENUM('pending','approved'),
      defaultValue:'pending'
    }

  },{
    freezeTableName:true
  })
}



function serviceProviderRatingModel(sequelize,Datatypes){
  return serviceProviderRating = sequelize.define('service_provider_rating',{
    provider_id:{
      type:Datatypes.INTEGER,
      allowNull:false,
      references:{
        model:'service_provider',
        key:'id'
      }
    },
    user_id:{
      type:Datatypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_userAccount',
        key:'user_id'
      }
    },
    rating:{
      type:Datatypes.INTEGER,
      allowNull:false,
    },
    review:{
      type:Datatypes.TEXT,
    }
  },{
    freezeTableName:true
  })
}

module.exports = {serviceProviderModel,serviceProviderRatingModel}