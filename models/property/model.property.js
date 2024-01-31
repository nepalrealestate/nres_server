
const { capitalizeFirstLetter } = require("../../utils/helperFunction/helper");
const logger = require("../../utils/errorLogging/logger");
require("dotenv").config();

const DB_PREFIX = process.env.DB_PREFIX;

const DB_NAME = DB_PREFIX?`${DB_PREFIX}_nres`:'nres'

const propertyAdminView = DB_PREFIX?`${DB_PREFIX}_nres.property_view_admin`:'nres.property_view_admin'

const propertyClientView = DB_PREFIX?`${DB_PREFIX}_nres.property_view_client`:'property_view_client'

const requestedPropertyView = DB_PREFIX?`${DB_PREFIX}_nres.requested_property_view`:'requested_property_view';

function propertyIdTrackerModel(sequelize, DataTypes) {
  const PropertyIdTracker = sequelize.define(
    "property_id_tracker",
    {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        primaryKey: true,
        allowNull: false,
      },
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      hooks: {
        afterSync: async () => {
          await PropertyIdTracker.findOrCreate({
            where: { id: 1 },
            defaults: { property_id: 1 },
          });
        },
      },
    },
  );
  return PropertyIdTracker;
}

// property views

function propertyViewAdminModel(sequelize, DataTypes) {
  async function createPropertyViewAdmin() {
    const sql = ` CREATE OR REPLACE VIEW ${propertyAdminView} AS

    SELECT    h.property_id,h.property_type, h.property_name,h.listed_for,h.province,h.district, h.municipality,h.area_name,h.price,h.property_image,h.owner_id,h.listing_type,h.status,h.createdAt,
    ha.twitter,ha.tiktok,ha.instagram,ha.facebook,ha.youtube
   FROM ${DB_NAME}.property_house as h INNER JOIN ${DB_NAME}.property_house_ads as ha ON h.property_id = ha.property_id
  
   UNION 
  
   SELECT l.property_id,l.property_type, l.property_name,l.listed_for,l.province,l.district,l.municipality,l.area_name,l.price,l.property_image,l.owner_id,l.listing_type,l.status, l.createdAt ,
    la.twitter,la.tiktok,la.instagram,la.facebook,la.youtube

   FROM ${DB_NAME}.property_land as l INNER JOIN ${DB_NAME}.property_land_ads as la ON l.property_id = la.property_id
   
   UNION
  
   SELECT a.property_id,a.property_type, a.property_name, a.listed_for,a.province,a.district, a.municipality,a.area_name,a.price,a.property_image,a.owner_id,a.listing_type,a.status, a.createdAt ,

  aa.twitter,aa.tiktok,aa.instagram,aa.facebook,aa.youtube
   FROM ${DB_NAME}.property_apartment as a INNER JOIN ${DB_NAME}.property_apartment_ads as aa ON a.property_id = aa.property_id;`;

    try {
      await sequelize.query(sql);
    } catch (error) {
      console.error("Error creating the view:", error);
      if (error.original && error.original.code === "ER_WRONG_OBJECT") {
        console.error(
          "property_view_client exists, but it is not a VIEW. Please fix your database schema."
        );
      }
    }
  }

  // createPropertyViewAdmin();

  createPropertyViewAdmin();

  return (PropertyViewAdmin = sequelize.define(
    "property_view_admin",
    {
      property_id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        unique:true,
      },
      property_type: {
        type: DataTypes.STRING,
      },
      property_name: {
        type: DataTypes.STRING,
      },
      listed_for: {
        type: DataTypes.STRING,
      },
      province: {
        type: DataTypes.STRING,
      },
      district: {
        type: DataTypes.STRING,
      },
      municipality: {
        type: DataTypes.STRING,
      },
      area_name:{
        type:DataTypes.STRING,
      },
      price:{
        type:DataTypes.BIGINT,
      },
      property_image:{
        type:DataTypes.JSON
      },
      owner_id:{
        type:DataTypes.INTEGER,
      },
      listing_type:{
        type:DataTypes.STRING
      },
      status:{
        type:DataTypes.STRING,
      },
      createdAt:{
        type:DataTypes.DATE
      },
      twitter: {
        type: DataTypes.STRING,
      },
      tiktok: {
        type: DataTypes.STRING,
      },
      instagram: {
        type: DataTypes.STRING,
      },
      facebook: {
        type: DataTypes.STRING,
      },
      youtube: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  ));
}

function propertyViewClientModel(sequelize, DataTypes) {
  async function createPropertyView() {
    const sql = `
    CREATE OR REPLACE VIEW ${propertyClientView} AS
  SELECT
    property_id,
    property_type,
    property_name,
    property_for,
    listed_for,
    province,
    district,
    municipality,
    area_name,
    latitude,
    longitude,
    price,
    social_media,
    property_image,
    views,
    owner_id,
    listing_type,
    status,
    createdAt,
    updatedAt
  FROM (
    SELECT
      h.property_id AS property_id,
      property_type,
      property_name,
      property_for,
      listed_for,
      province,
      district,
      municipality,
      area_name,
      latitude,
      longitude,
      price,
      social_media,
      property_image,
      COALESCE(house_views.views, 0) AS views,
      owner_id,
      listing_type,
      status,
      h.createdAt,
      h.updatedAt,
      ROW_NUMBER() OVER (PARTITION BY h.property_id ORDER BY h.createdAt) AS row_num
    FROM ${DB_NAME}.property_house AS h
    LEFT JOIN ${DB_NAME}.property_house_views_count AS house_views ON h.property_id = house_views.property_id

    UNION

    SELECT
      l.property_id AS property_id,
      property_type,
      property_name,
      property_for,
      listed_for,
      province,
      district,
      municipality,
      area_name,
      latitude,
      longitude,
      price,
      social_media,
      property_image,
      COALESCE(land_views.views, 0) AS views,
      owner_id,
      listing_type,
      status,
      l.createdAt,
      l.updatedAt,
      ROW_NUMBER() OVER (PARTITION BY l.property_id ORDER BY l.createdAt) AS row_num
    FROM ${DB_NAME}.property_land AS l
    LEFT JOIN ${DB_NAME}.property_land_views_count AS land_views ON l.property_id = land_views.property_id

    UNION

    SELECT
      a.property_id AS property_id,
      property_type,
      property_name,
      property_for,
      listed_for,
      province,
      district,
      municipality,
      area_name,
      latitude,
      longitude,
      price,
      social_media,
      property_image,
      COALESCE(apartment_views.views, 0) AS views,
      owner_id,
      listing_type,
      status,
      a.createdAt,
      a.updatedAt,
      ROW_NUMBER() OVER (PARTITION BY a.property_id ORDER BY a.createdAt) AS row_num
    FROM ${DB_NAME}.property_apartment AS a
    LEFT JOIN ${DB_NAME}.property_apartment_views_count AS apartment_views ON a.property_id = apartment_views.property_id
  ) AS subquery
  WHERE row_num = 1;


  `;

    try {
      await sequelize.query(sql);
    } catch (error) {
      logger.error("Error creating the view:", error)
      console.error("Error creating the view:", error);
      if (error.original && error.original.code === "ER_WRONG_OBJECT") {
        logger.error("property_view_client exists, but it is not a VIEW. Please fix your database schema.")
        console.error(
          "property_view_client exists, but it is not a VIEW. Please fix your database schema."
        );
      }
    }
  }
  createPropertyView();

  return (PropertyView = sequelize.define(
    "property_view_client",
    {
      property_id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        unique:true
      },
      property_type: {
        type: DataTypes.STRING,
      },
      property_name: {
        type: DataTypes.STRING,
      },
      property_for: {
        type: DataTypes.STRING,
      },
      listed_for: {
        type: DataTypes.STRING,
      },
      district: {
        type: DataTypes.STRING,
      },
      municipality: {
        type: DataTypes.STRING,
      },
      area_name:{
        type:DataTypes.STRING,
      },
      price:{
        type:DataTypes.BIGINT,
      },
      latitude:{
        type:DataTypes.DECIMAL(9,6)
      },
      longitude:{
        type:DataTypes.DECIMAL(9,6)
      },
      social_media:{
        type:DataTypes.JSON
      },
      property_image:{
        type:DataTypes.JSON
      },
      views:{
        type:DataTypes.INTEGER
      },
      owner_id:{
        type:DataTypes.INTEGER
      },
      listing_type:{
        type:DataTypes.STRING
      },
      status:{
        type:DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt:{
        type:DataTypes.DATE
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  ));
}

function propertyShootScheduleModel(sequelize, DataTypes) {
  
  return PropertyShootSchedule = sequelize.define('property_shoot_schedule',{
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    
    property_type:{
        type:DataTypes.ENUM('apartment','land','house')
     },
     listed_for:{
        type:DataTypes.ENUM('sale','rent')
     },
     location:{
      type:DataTypes.STRING,
     },
     owner:{
      type:DataTypes.STRING
     },
     contact:{
      type:DataTypes.STRING,
     },
     scheduled_date:{
       type:DataTypes.DATE,
       allowNull:false
     },
     longitude:{
        type:DataTypes.DECIMAL(9,6),
     },
     latitude:{
        type:DataTypes.DECIMAL(9,6),
     },
     shoot_status:{
      type:DataTypes.ENUM("scheduled","completed","ready_to_post"),
      defaultValue:"scheduled"
    },
    },{
      freezeTableName:true
    }
  )
}

function propertyShootScheduleCommentModel(sequelize,DataTypes){
  return PropertyShootScheduleComment = sequelize.define('property_shoot_schedule_comment',{
    shoot_schedule_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'property_shoot_schedule',
        key:'id'
      },
      onDelete:'CASCADE'
    },
    admin_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_adminAccount',
        key:'admin_id'
      }
    },
    comment:{
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notEmpty:true
      } 
    }

  },{
    freezeTableName:true
  })
}

function propertyFieldVisitRequestModel(sequelize,DataTypes){

  return sequelize.define('property_field_visit_request',{
    field_visit_id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      ondelete:'CASCADE'
    },
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    property_type:{
      type:DataTypes.ENUM('house','apartment','land')
    },
    request_date:{
      type:DataTypes.DATE
    },
    schedule_date:{
      type:DataTypes.DATE,
    },
    status:{
      type:DataTypes.ENUM('not-schedule','schedule','visited','not-visited','cancelled'),
      defaultValue:'not-schedule'
    }

  },
  { 
    freezeTableName:true,
    primaryKey: ['property_id', 'user_id'],
    uniqueKeys: {
      unique_property_user: {
        fields: ['property_id', 'user_id']
      }
    }
  }
  )

}

function propertyFieldVisitCommentModel(sequelize,DataTypes){
  return sequelize.define('property_field_visit_comment',{
    field_visit_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'property_field_visit_request',
        key:'field_visit_id'
      },
      ondelete:'CASCADE'
    },
    comment:{
      type:DataTypes.TEXT,
      allowNull:false,
    },

    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE'
      
    },
  

  },{
      freezeTableName:true
    
  })
  
}

function propertyFieldVisitOTPModel(sequelize,DataTypes){
  return sequelize.define('property_field_visit_otp',{

    field_visit_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'property_field_visit_request',
        key:'field_visit_id'
      },
      onDelete:'CASCADE',
      unique:true
    },
    otp:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
   
  },{
    freezeTableName:true,
  })
}

function requestPropertyNegotiationModel(sequelize,DataTypes){
  return sequelize.define('property_field_visit_negotiation',{
    field_visit_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'property_field_visit_request',
        key:'field_visit_id'
      },
      onDelete:'CASCADE'
    },
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE',
    },
    negotiation:{
      type:DataTypes.TEXT,
      allowNull:false
    },
   
  },{
    freezeTableName:true,
    indexes: [{
      unique: true,
      fields: ['field_visit_id', 'user_id']
  }]
  })
}

function requestPropertyAgreementModel(sequelize,DataTypes){

  return sequelize.define('property_field_visit_agreement',{
    field_visit_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'property_field_visit_request',
        key:'field_visit_id'
      },
      onDelete:'CASCADE'
    },
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE',
    },
   
  },{
    freezeTableName:true,
    indexes: [{
      unique: true,
      fields: ['field_visit_id', 'user_id']
  }]
  })

}




function requestedPropertyModel(sequelize,DataTypes){
  return RequestedProperty = sequelize.define('property_requested_property',{
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    property_type:{
      type:DataTypes.ENUM('house','apartment','land')
    },
    request_for:{
      type:DataTypes.ENUM('sale','rent','buy')
    },
    province:{
      type:DataTypes.STRING
    },
    district:{
      type:DataTypes.STRING
    },
    area_name:{
      type:DataTypes.STRING
    },
    property_details:{
      type:DataTypes.JSON
    },
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE'
    }
  },{
    freezeTableName:true
  })
  }



function favouritePropertyModel(sequelize,DataTypes){
  return FavouriteProperty = sequelize.define('property_favourite',{
   
    property_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    property_type:{
      type:DataTypes.ENUM('house','apartment','land')
    },
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE'
    }
  },{
    freezeTableName:true,
    primaryKey: ['property_id', 'user_id'],
    uniqueKeys: {
      unique_property_user: {
        fields: ['property_id', 'user_id']
      }
    }
  })
}



function homeLoanModel(sequelize,DataTypes){
  return HomeLoan = sequelize.define('property_home_loan',{
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE'
    },
    loan_amount:{
      type:DataTypes.STRING,
      allowNull:false
    },
    property_id:{
      type:DataTypes.INTEGER,
    },
    property_type:{
      type:DataTypes.ENUM('house','apartment','land')
    },
   
  
  },{
    freezeTableName:true,
    primaryKey: ['property_id', 'user_id'],
    uniqueKeys: {
      unique_property_user: {
        fields: ['property_id', 'user_id']
      }
    }
  })
}

function propertyMoreInfoRequestModel(sequelize,DataTypes){
  return PropertyMoreInfoRequest = sequelize.define('property_more_info_request',{
    user_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE'
    },
    property_id:{
      type:DataTypes.INTEGER,
    },
    property_type:{
      type:DataTypes.ENUM('house','apartment','land')
    },
    description:{
      type:DataTypes.TEXT
    }

  },{
    freezeTableName:true,
    primaryKey: ['property_id', 'user_id'],
    uniqueKeys: {
      unique_property_user: {
        fields: ['property_id', 'user_id']
      }
    }
  })
}




module.exports = {
  propertyIdTrackerModel,
  propertyViewAdminModel,
  propertyShootScheduleModel,
  propertyShootScheduleCommentModel,
  propertyViewClientModel,
  propertyFieldVisitRequestModel, 
  propertyFieldVisitCommentModel,
  propertyFieldVisitOTPModel,
  requestedPropertyModel,
  favouritePropertyModel,
  homeLoanModel,
  propertyMoreInfoRequestModel,
  requestPropertyNegotiationModel,
  requestPropertyAgreementModel
};
