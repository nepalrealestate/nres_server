
// ----------------------------CREATE APARTMENT DATA--------------------------------

// apartment model 
function apartmentModel (sequelize,DataTypes){
    return Apartment = sequelize.define('property_apartment',{
      property_id :{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true,
        primaryKey:true,
      
      },
      property_type :{
        type:DataTypes.ENUM('commercial','residential','office')
      },
      property_name : {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          notEmpty: true, 
        }
      },
      listed_for :{
        type:DataTypes.ENUM('sell','rent')
      },
     
      property_age:{
        type:DataTypes.INTEGER
      },
      floor:{
        type:DataTypes.FLOAT
      },
     bhk:{
        type:DataTypes.INTEGER
     }, 
      facing:{
        type:DataTypes.ENUM('east','west','north','south','east-north','east-south','west-north','west-south')
      },
      province:{
        type:DataTypes.STRING
      },
      district:{
        type:DataTypes.STRING
      },
      municipality:{
        type:DataTypes.STRING
      },
      ward:{
        type:DataTypes.INTEGER
      },
      landmark:{
        type:DataTypes.STRING
      },
      latitude:{
        type:DataTypes.DECIMAL(9,6)
      },
      longitude:{
        type:DataTypes.DECIMAL(9,6)
      },
      property_area:{
        type:DataTypes.FLOAT
      },
      road_size:{
        type:DataTypes.FLOAT
      },
      price:{
        type:DataTypes.DECIMAL(12,2),
        allowNull:false
      },
      price_type:{
        type:DataTypes.ENUM('fixed','negotiable')
      },
      furnish:{
        type:DataTypes.ENUM('non-furnished','furnished','semi-furnished')
      },
      parking_bike:{
        type:DataTypes.INTEGER
      },
      parking_car:{
        type:DataTypes.INTEGER
      },
      amenities:{
        type:DataTypes.JSON
      },
      description:{
        type:DataTypes.TEXT
      },
      property_image:{
        type:DataTypes.JSON
      },
      property_video:{
        type:DataTypes.JSON
      },
      staff_id:{
        type:DataTypes.INTEGER,
         references:{
           model:'user_staffs',
           key :'staff_id'
         }
        
      },
      customer_id:{
        type:DataTypes.INTEGER,
        references:{
          model:'user_customers',
          key :'customer_id'
        }
      },
      agent_id :{
        type:DataTypes.INTEGER,
        references:{
          model:'user_agents',
          key :'agent_id'
        }
      },
      views:{
        type:DataTypes.INTEGER,
        defaultValue:0
  
      }
      
  
  
    },{
      freezeTableName: true,
    }
    )
  }
  

function pendingApartmentModel (sequelize,DataTypes){

  return PendingApartment = sequelize.define('property_pending_apartment',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      autoIncrement:true,
      primaryKey:true,
    },
    property_type :{
      type:DataTypes.ENUM('commercial','residential','office')
    },
    property_name : {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty: true, 
      }
    },
    listed_for :{
      type:DataTypes.ENUM('sell','rent')
    },
   
    property_age:{
      type:DataTypes.INTEGER
    },
    floor:{
      type:DataTypes.FLOAT
    },
   bhk:{
      type:DataTypes.INTEGER
   }, 
    facing:{
      type:DataTypes.ENUM('east','west','north','south','east-north','east-south','west-north','west-south')
    },
    province:{
      type:DataTypes.STRING
    },
    district:{
      type:DataTypes.STRING
    },
    municipality:{
      type:DataTypes.STRING
    },
    ward:{
      type:DataTypes.INTEGER
    },
    landmark:{
      type:DataTypes.STRING
    },
    latitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    longitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    property_area:{
      type:DataTypes.FLOAT
    },
    road_size:{
      type:DataTypes.FLOAT
    },
    price:{
      type:DataTypes.DECIMAL(12,2),
      allowNull:false
    },
    price_type:{
      type:DataTypes.ENUM('fixed','negotiable')
    },
    furnish:{
      type:DataTypes.ENUM('non-furnished','furnished','semi-furnished')
    },
    parking_bike:{
      type:DataTypes.INTEGER
    },
    parking_car:{
      type:DataTypes.INTEGER
    },
    amenities:{
      type:DataTypes.JSON
    },
    description:{
      type:DataTypes.TEXT
    },
    property_image:{
      type:DataTypes.JSON
    },
    property_video:{
      type:DataTypes.JSON
    },
    staff_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_staffs',
        key :'staff_id'
      } 
    },
    customer_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_customers',
        key :'customer_id'
      }
    },
    agent_id :{
      type:DataTypes.INTEGER,
      references:{
        model:'user_agents',
        key :'agent_id'
      }
    },
    views:{
      type:DataTypes.INTEGER,
      defaultValue:0

    }
  },{
    freezeTableName: true,
  })

}

 function apartmentAdsModel(sequelize,DataTypes){
  return ApartmentAds = sequelize.define('property_apartment_ads',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_apartments',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    ads_status: {
      type: DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    }

  },{
    freezeTableName: true,
  })
}


 function apartmentFeedbackModel(sequelize,DataTypes){
  return ApartmentFeedback = sequelize.define('property_apartment_feedback',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_apartments',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    customer_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_customers',
        key:'customer_id'
      }
    },

    feedback:{
      type:DataTypes.TEXT('tiny'),
      allowNull: false,
      validate: {
        notEmpty: true,
      },

    }

  },{
    freezeTableName: true,
  })
}



function apartmentCommentModel(sequelize,DataTypes){
  return ApartmentComment = sequelize.define('property_apartment_comment',{
    comment_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_apartments',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_staffs', // replace with your Staff model name
        key: 'staff_id',
      },
      onDelete: 'CASCADE',
    },
    super_admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_superAdmins', // replace with your SuperAdmin model name
        key: 'superAdmin_id',
      },
      onDelete: 'CASCADE',
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull:false,
      validate:{
        notEmpty: true,
      }
    },
    is_private: {
      type: DataTypes.BOOLEAN,
    },
    

  },{
    freezeTableName: true,
  },{
    freezeTableName: true,
  })
}



function apartmentViewsModel (sequelize,DataTypes){
  return ApartmentViews = sequelize.define('property_apartment_views',{
    id :{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'property_apartments',
        key: 'property_id'
    }
    },
    latitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    longitude:{
      type:DataTypes.DECIMAL(9,6)
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue:DataTypes.NOW
  },
  },{
    freezeTableName: true,
  }
  
  )
}





module.exports = {
    apartmentModel,
    apartmentAdsModel,
    apartmentFeedbackModel,
    apartmentCommentModel,
    pendingApartmentModel,
    apartmentViewsModel
};