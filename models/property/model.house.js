

function houseModel (sequelize,DataTypes){
  return House = sequelize.define('property_house',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      primaryKey:true,
    },
    property_type:{
      type:DataTypes.ENUM('house'),
      defaultValue:"house"
    },
    property_for :{
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
      type:DataTypes.ENUM('sale','rent')
    },
   
    property_age:{
      type:DataTypes.INTEGER
    },
    floor:{
      type:DataTypes.FLOAT
    },
    bedrooms:{
      type:DataTypes.INTEGER
    },
    kitchen:{
      type:DataTypes.INTEGER
    },
    bathrooms_attached:{
      type:DataTypes.INTEGER
    },
    bathrooms_common:{
      type:DataTypes.INTEGER
    },
    facing:{
      type:DataTypes.ENUM('east','west','north','south','north-east','south-east','north-west','south-west')
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
    area_name:{
      type:DataTypes.STRING
    } ,     
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
    social_media:{
      type:DataTypes.JSON
    },
    property_image:{
      type:DataTypes.JSON
    },
    approved_by:{
      type:DataTypes.INTEGER,
       references:{
         model:'user_adminAccount',
         key :'admin_id'
       },
       onDelete :'SET NULL'
      
    },
    owner_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE'
    }
  }
  ,{
    freezeTableName: true,
  }
  )
}


function pendingHouseModel (sequelize,DataTypes){
  return PendingHouse = sequelize.define('property_pending_house',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      autoIncrement:true,
      primaryKey:true,
    },
    property_type:{
      type:DataTypes.ENUM('house'),
      defaultValue:"house"
    },
    property_for :{
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
      type:DataTypes.ENUM('sale','rent')
    },
   
    property_age:{
      type:DataTypes.INTEGER
    },
    floor:{
      type:DataTypes.FLOAT
    },
    bedrooms:{
      type:DataTypes.INTEGER
    },
    kitchen:{
      type:DataTypes.INTEGER
    },
    bathrooms_attached:{
      type:DataTypes.INTEGER
    },
    bathrooms_common:{
      type:DataTypes.INTEGER
    },
    facing:{
      type:DataTypes.ENUM('east','west','north','south','north-east','south-east','north-west','south-west')
    },
    province:{
      type:DataTypes.STRING
    },
    zone:{
      type:DataTypes.STRING
    },
    district:{
      type:DataTypes.STRING
    },
    municipality:{
      type:DataTypes.STRING
    },
    area_name:{
      type:DataTypes.STRING
    } ,     
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
    social_media:{
      type:DataTypes.JSON
    },
    property_image:{
      type:DataTypes.JSON
    },
    approved_by:{
      type:DataTypes.INTEGER,
      default:null,
       references:{
         model:'user_adminAccount',
         key :'admin_id'
       },
       onDelete :'SET NULL'
      
    },
    owner_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE'
    }



  }
  ,{
    freezeTableName: true,
  })
}

  

function houseAdsModel (sequelize,DataTypes){
  return HouseAds = sequelize.define('property_house_ads',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_house',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    twitter:{
      type:DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    },
    tiktok:{
      type:DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    },
    instagram:{
      type:DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    },
    facebook:{
      type:DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    },
    youtube:{
      type:DataTypes.ENUM('unplanned','posted','progress','planned'),
      defaultValue: 'unplanned'
    },

  }
  ,{
    freezeTableName: true,
  })
}



function houseFeedbackModel(sequelize,DataTypes){
  return HouseFeedback = sequelize.define('property_house_feedback',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_house',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'customer_id'
      },
      onDelete: 'CASCADE'
    },

    feedback:{
      type:DataTypes.TEXT('tiny'),
      allowNull: false,
      validate: {
        notEmpty: true,
      }

    }
  }
  ,{
    freezeTableName: true,
  }
  )
}




function houseCommentModel(sequelize,DataTypes){
  return HouseComment = sequelize.define('property_house_comment',{
    comment_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_house',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_adminAccount', // replace with your Staff model name
        key: 'admin_id',
      },
      onDelete: 'CASCADE'
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
    }
  }
  ,{
    freezeTableName: true,
  })
}



function houseViewsModel (sequelize,DataTypes){
  return HouseViewsCount = sequelize.define('property_house_views',{
    id :{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'property_house',
        key: 'property_id'
    },
    onDelete: 'CASCADE',
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
    hooks:{
      afterCreate:async (instance,options)=>{

        const houseViewsCount = sequelize.models.property_house_views_count;

        houseViewsCount.findOrCreate({
          where: { property_id: instance.property_id },
          defaults: { views: 0 }
        }).then(([houseViewCount, created]) => {
          if (!created) {
            houseViewCount.increment('views', { by: 1 });
          }
        }).catch(error => {
          // Handle the error if necessary
          console.error("Error updating views count:", error);
          logger.error(`Error while update Apartment Views - ${error}`)
        });
        
      }
    }
    }
  
  
  )
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
        model:'property_apartment',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_staff', // replace with your Staff model name
        key: 'staff_id',
      },
      onDelete: 'CASCADE',
    },
    super_admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_superAdmin', // replace with your SuperAdmin model name
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
        model: 'property_apartment',
        key: 'property_id'
    },
    onDelete:'CASCADE'
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

function houseViewsCountModel(sequelize,DataTypes){

  return HouseViewsCount  = sequelize.define('property_house_views_count',{
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_house',
        key:'property_id'
      },
      onDelete:'CASCADE'
    },
    views:{
      type:DataTypes.INTEGER,
      defaultValue:0
    }
  },{
    freezeTableName:true
  })

}

function requestedHouseModel(sequelize,DataTypes){
  return RequestedHouse = sequelize.define('property_requested_house',{
    
    property_type :{
      type:DataTypes.ENUM('commercial','residential','office')
    },
    property_area:{
      type:DataTypes.FLOAT
    },
    property_age:{
      type:DataTypes.INTEGER
    },
    floor:{
      type:DataTypes.FLOAT
    },
    bedrooms:{
      type:DataTypes.INTEGER
   }, 
   kitchen:{
    type:DataTypes.INTEGER
   },
   living_rooms:{
    type:DataTypes.INTEGER
   },
    facing:{
      type:DataTypes.ENUM('east','west','north','south','east-north','east-south','west-north','west-south')
    },
    road_size:{
      type:DataTypes.FLOAT
    },
   minPrice:{
    type:DataTypes.DECIMAL(12,2),
    allowNull:false
   },
   maxPrice:{
    type:DataTypes.DECIMAL(12,2),
    allowNull:false
   },
    
  furnish:{
    type:DataTypes.ENUM('non-furnished','furnished','semi-furnished')
  },
  description:{
    type:DataTypes.TEXT
  },
  needed:{
    type: DataTypes.ENUM(
      'urgent',
      'within a month',
      'within 3 months',
      'within a year',
      'after a year'
    ),
    
  },
    province:{
      type:DataTypes.STRING
    },
    zone:{
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
      validate:{
          isEmail:true,
          notEmpty:true
      }
    },
    phone_number:{
    type:DataTypes.STRING,
    unique:true,
    validate:{
      notEmpty:true
    },
  },
  address:{
    type:DataTypes.STRING
  },
  },{freezeTableName:true})
}





module.exports = {
  houseModel,
  pendingHouseModel,
  houseCommentModel,
  houseFeedbackModel,
  houseAdsModel,
  houseViewsModel,
  houseViewsCountModel,
  requestedHouseModel,
  
};
