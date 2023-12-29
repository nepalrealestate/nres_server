

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
    house_type:{
      type:DataTypes.STRING,
    },
    built_up_area:{
      type:DataTypes.FLOAT
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
    land_area:{
      type:DataTypes.STRING
    },
    road_access:{
      type:DataTypes.FLOAT
    },
    pillar:{
      type:DataTypes.STRING
    },
    phase_line:{
      type:DataTypes.STRING
    },
    material_used:{
      type:DataTypes.STRING
    },

    floor:{
      type:DataTypes.FLOAT
    },
    bedroom:{
      type:DataTypes.INTEGER
    },
    kitchen:{
      type:DataTypes.INTEGER
    },
    dining:{
      type:DataTypes.INTEGER
    },
    bathroom:{
      type:DataTypes.INTEGER
    },
    living_room:{
      type:DataTypes.INTEGER
    },
    store:{
      type:DataTypes.INTEGER
    },
    servant_quarter:{
      type:DataTypes.INTEGER
    },
    pooja_room:{
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
    approved_by_id:{
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
  }
  ,{
    freezeTableName: true,
  }
  )
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
        key:'user_id'
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
          defaults: { views: 1 }
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



function homeLoanModel(sequelize,DataTypes){
  return homeLoan = sequelize.define('home_loan',{

    name:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    email:{
      type:DataTypes.STRING,
    },
    phone_number:{
      type:DataTypes.STRING,
    },
    loan_amount:{
      type:DataTypes.BIGINT
    },

  },{
    freezeTableName:true
  })
}

function houseFavouriteModel(sequelize,DataTypes){
  return HouseFavourite = sequelize.define('property_house_favourite',{
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
      allowNull:false,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete: 'CASCADE'
    },
  },{
    freezeTableName:true
  })
}



module.exports = {
  houseModel,
  houseCommentModel,
  houseFeedbackModel,
  houseAdsModel,
  houseViewsModel,
  houseViewsCountModel, 
  homeLoanModel,
  houseFavouriteModel
};
