
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
    
  
    SELECT   h.property_id,h.property_type, h.property_name,h.property_for,h.listed_for,h.province,h.district, h.municipality,h.area_name,h.latitude,h.longitude,h.price,h.social_media,h.property_image, COALESCE(house_views.views, 0) AS views,h.owner_id,h.listing_type,h.status, h.createdAt,h.updatedAt

    FROM ${DB_NAME}.property_house  as h LEFT JOIN ${DB_NAME}.property_house_views_count as house_views ON h.property_id=house_views.property_id
   
    UNION 
   
    SELECT l.property_id,l.property_type, l.property_name,l.property_for,l.listed_for,l.province,l.district,l.municipality,l.area_name,l.latitude,l.longitude,l.price,l.social_media,l.property_image, COALESCE(land_views.views, 0) AS views, l.owner_id,l.listing_type,l.status,l.createdAt ,l.updatedAt
  
  
    FROM ${DB_NAME}.property_land as l  LEFT JOIN ${DB_NAME}.property_land_views_count as land_views ON l.property_id=land_views.property_id
    
    UNION
   
    SELECT a.property_id,a.property_type, a.property_name,a.property_for, a.listed_for,a.province,a.district, a.municipality,a.area_name,a.latitude,a.longitude,a.price,a.social_media,a.property_image, COALESCE(apartment_views.views, 0) AS views,a.owner_id,a.listing_type,a.status, a.createdAt ,a.updatedAt
  
    FROM ${DB_NAME}.property_apartment as a LEFT JOIN ${DB_NAME}.property_apartment_views_count as apartment_views ON a.property_id=apartment_views.property_id 
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
    visit_status:{
      type:DataTypes.ENUM('not-schedule','schedule','visited'),
      defaultValue:'not-schedule'
    },
    status:{
      type:DataTypes.ENUM('pending','approve'),
      defaultValue:'pending'
    }

  },
  { 
    hooks:{
      beforeCreate:async (instance,options)=>{
        const {property_id,property_type} = instance;
        console.log(instance)

        //const modelName = capitalizeFirstLetter(property_type);
        const modelName = `property_${property_type}`
        
        console.log(sequelize.models[modelName])
        // check property exists for not with property type and 
        console.log(sequelize.models[modelName])
        const property = await sequelize.models[modelName].findOne({
          where:{
           property_id:property_id,
            property_type:property_type
          }
        })
       

        if(!property){
          throw new sequelize.Sequelize.ValidationError(`Invalid Propery ID ${property_id} for ${property_type}`)
          
        }
      }
    },
    freezeTableName:true
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
      validate: {
        notEmpty: true,
      },
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
    // hooks:{
    //   beforeValidate: (instance)=>{
    //     if(instance.staff_id && instance.superAdmin_id){
    //       throw new sequelize.ValidationError('Only one of staff_id or superAdmin_id can be set.')
    //     }
    //     if (!instance.staff_id && !instance.superAdmin_id) {
    //       throw new sequelize.ValidationError('Either staff_id or superAdmin_id must be set.');
    //     }
    //   }
    // },
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
      onDelete:'CASCADE'
    },
    customer_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_userAccount',
        key:'user_id'
      },
      onDelete:'CASCADE',
    },
    otp:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
   
  },{
    freezeTableName:true,
    indexes: [{
      unique: true,
      fields: ['field_visit_id', 'customer_id']
  }]
  })
}


function propertyFieldVisit(sequelize,DataTypes){
  return sequelize.define('property_field_visit',{
    field_visit_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'property_field_visit_request',
        key:'field_visit_id'
      },
      onDelete:'SET NULL'
    },
    customer_id:{
        type:DataTypes.INTEGER,
        references:{
          model:'user_userAccount',
          key:'user_id'
        },
        onDelete:'SET NULL',
      },
      property_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      property_type:{
        type:DataTypes.ENUM('house','apartment','land') 
      }
    },{
      freezeTableName:true,
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
    },
    ward:{
      type:DataTypes.STRING
    },
    property_details:{
      type:DataTypes.JSON
    },
    name:{
      type:DataTypes.STRING,
      required:true
    },
    email:{
      type:DataTypes.STRING,
    },
    contact:{
      type:DataTypes.STRING,
      required:true
    },
    address:{
      type:DataTypes.STRING
    },
  },{
    freezeTableName:true
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
  propertyFieldVisit,
  requestedPropertyModel,
};
