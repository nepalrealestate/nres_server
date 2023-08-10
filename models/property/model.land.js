

// Create Land Table

// sequlize
function landModel (sequelize,DataTypes){
  return Land = sequelize.define('property_land',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      primaryKey:true,
    },
    property_type :{
      type:DataTypes.ENUM('non-plotted','plotted')
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
    posted_date:{
      type:DataTypes.DATE
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


function pendingLandModel (sequelize,DataTypes){
  return PendingLand = sequelize.define('property_pending_land',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      autoIncrement:true,
      primaryKey:true,
    },
    property_type :{
      type:DataTypes.ENUM('non-plotted','plotted')
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
    posted_date:{
      type:DataTypes.DATE
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


function landAdsModel (sequelize,DataTypes){
  return LandAds = sequelize.define('property_land_ads',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_land',
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


function landFeedbackModel (sequelize,DataTypes){
  return LandFeedback = sequelize.define('property_land_feedback',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_lands',
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
      }

    }
  },{
    freezeTableName: true,
  })
}


function landCommentModel (sequelize,DataTypes){
  return LandComment = sequelize.define('property_land_comment',{
    comment_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_lands',
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
    }
  },{
    freezeTableName: true,
  })
}


function landViewsModel (sequelize,DataTypes){
  return LandViews = sequelize.define('property_land_views',{
    id :{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'property_land',
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

function requestedLandModel(sequelize,DataTypes){
  return RequestedLand = sequelize.define('property_requested_land',{
    
    property_type :{
      type:DataTypes.ENUM('non-plotted','plotted')
    },
    property_area:{
      type:DataTypes.FLOAT
    },
    road_size:{
      type:DataTypes.FLOAT
    },
    sewage:{
      type:DataTypes.BOOLEAN
    },
      
    furnish:{
    type:DataTypes.ENUM('non-furnished','furnished','semi-furnished')
    },
    drinking_water:{
      type:DataTypes.BOOLEAN
    },
    electricity:{
      type:DataTypes.BOOLEAN
    },
   minPrice:{
    type:DataTypes.DECIMAL(12,2),
    allowNull:false
   },
   maxPrice:{
    type:DataTypes.DECIMAL(12,2),
    allowNull:false
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
  landModel,
  pendingLandModel,
  landAdsModel,
  landCommentModel,
  landFeedbackModel,
  landViewsModel,
  requestedLandModel
};
