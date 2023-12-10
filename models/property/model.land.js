

// Create Land Table

const logger = require("../../utils/errorLogging/logger")

// sequlize
function landModel (sequelize,DataTypes){
  return Land = sequelize.define('property_land',{
    property_id :{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      primaryKey:true,
    },
    property_type:{
      type:DataTypes.ENUM('land'),
      defaultValue:"land"
    },
    property_for :{
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
      type:DataTypes.ENUM('sale','rent')
    },
    twist:{
      type:DataTypes.FLOAT
    },
    property_area:{
      type:DataTypes.STRING
    },
    road_size:{
      type:DataTypes.FLOAT
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
    },
    listing_type:{
      type:DataTypes.ENUM("free","top","premium","featured"),
      defaultValue:"free"
    },
    status:{
      type:DataTypes.ENUM("pending","approved","sold")
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
        model:'property_land',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
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
        model:'property_land',
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




function landViewsModel(sequelize,DataTypes){
  const LandViews = sequelize.define('property_land_views',{
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

    hooks:{
      afterCreate:async (instance,options)=>{

    
        const LandViewsCount = sequelize.models.property_land_views_count;
      
        LandViewsCount.findOrCreate({
          where: { property_id: instance.property_id },
          defaults: { views: 1 }
        }).then(([landViewCount, created]) => {
          if (!created) {
            landViewCount.increment('views', { by: 1 });
          }
        }).catch(error => {
          // Handle the error if necessary
          console.error("Error updating views count:", error);
          logger.error(`Error while update Land Views - ${error}`)
        });
        
      }
    }
  }
 
  
  ) 
  return LandViews;
}

function landViewsCountModel(sequelize,DataTypes){
  return LandViewsCount = sequelize.define('property_land_views_count',{
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'property_land',
        key: 'property_id'
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









module.exports = {
  landModel,
  landAdsModel,
  landCommentModel,
  landFeedbackModel,
  landViewsModel,
  landViewsCountModel, 
};
