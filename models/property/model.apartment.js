
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
      property_type:{
        type:DataTypes.ENUM('apartment'),
        defaultValue:"apartment"
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
      property_area:{
        type:DataTypes.STRING
      },
      listed_for :{
        type:DataTypes.ENUM('sale','rent')
      },
      road_access:{
        type:DataTypes.FLOAT
      },
     bhk:{
        type:DataTypes.STRING
     }, 
     bedroom:{
        type:DataTypes.INTEGER
     },
      bathroom:{
          type:DataTypes.INTEGER
      },
      living_room:{
          type:DataTypes.INTEGER
      },
      kitchen:{
          type:DataTypes.INTEGER
      },
      dining:{
          type:DataTypes.INTEGER
      },
      servant_quarter:{
          type:DataTypes.INTEGER
      },
      store_room:{
          type:DataTypes.INTEGER
      },
      extra_room:{
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
      
      price:{
        type:DataTypes.BIGINT,
        allowNull:false
      },
      price_per:{
        type:DataTypes.STRING
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
         onDelete:'SET NULL'
        
      },
      owner_id:{
        type:DataTypes.INTEGER,
        references:{
          model:'user_userAccount',
          key:'user_id'
        },
        onDelete:'CASCADE'
      },
      owner_name:{
        type:DataTypes.STRING
      },
      owner_phone:{
        type:DataTypes.STRING
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
     
    }
    )
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
        model:'property_apartment',
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
        model:'property_apartment',
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
        model:'property_apartment',
        key:'property_id'
      },
      onDelete: 'CASCADE'
    },
    admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_adminAccount', 
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

        const apartmentViewsCount = sequelize.models.property_apartment_views_count;
  
        apartmentViewsCount.findOrCreate({
          where: { property_id: instance.property_id },
          defaults: { views: 1 }
        }).then(([apartmentViewCount, created]) => {
          if (!created) {
            apartmentViewCount.increment('views', { by: 1 });
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

function apartmentViewsCountModel(sequelize,DataTypes){

  return ApartmentViewsCount  = sequelize.define('property_apartment_views_count',{
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_apartment',
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










module.exports = {
    apartmentModel,
    apartmentAdsModel,
    apartmentFeedbackModel,
    apartmentCommentModel,
    apartmentViewsModel,
    apartmentViewsCountModel,
};