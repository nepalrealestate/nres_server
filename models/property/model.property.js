const { capitalizeFirstLetter } = require("../../utils/helperFunction/helper");


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
      hooks: {
        afterSync: async () => {
          await PropertyIdTracker.findOrCreate({
            where: { id: 1 },
            defaults: { property_id: 1 },
          });
        },
      },
    }
  );
  return PropertyIdTracker;
}

// property views

function propertyViewAdminModel(sequelize, DataTypes) {
  async function createPropertyViewAdmin() {
    const sql = ` CREATE OR REPLACE VIEW property_view_admin AS

    SELECT    h.property_id,h.property_type, h.property_name,h.listed_for,h.district, h.municipality,h.area_name,h.price,h.property_image,h.views, h.createdAt  ,
    ha.twitter,ha.tiktok,ha.instagram,ha.facebook,ha.youtube
   FROM nres.property_house as h INNER JOIN nres.property_house_ads as ha ON h.property_id = ha.property_id
  
   UNION 
  
   SELECT l.property_id,l.property_type, l.property_name,l.listed_for,l.district,l.municipality,l.area_name,l.price,l.property_image,l.views, l.createdAt ,
    la.twitter,la.tiktok,la.instagram,la.facebook,la.youtube

   FROM nres.property_land as l INNER JOIN nres.property_land_ads as la ON l.property_id = la.property_id
   
   UNION
  
   SELECT a.property_id,a.property_type, a.property_name, a.listed_for,a.district, a.municipality,a.area_name,a.price,a.property_image,a.views, a.createdAt ,

    aa.twitter,aa.tiktok,aa.instagram,aa.facebook,aa.youtube
   FROM nres.property_apartment as a INNER JOIN nres.property_apartment_ads as aa ON a.property_id = aa.property_id;`;

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
        type:DataTypes.DECIMAL(12,2),
      },
      property_image:{
        type:DataTypes.JSON
      },
      views:{
        type:DataTypes.INTEGER
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
    CREATE OR REPLACE VIEW property_view_client AS
    
  
    SELECT   h.property_id,h.property_type, h.property_name,h.listed_for,h.district, h.municipality,h.area_name,h.price,h.property_image,h.views, h.createdAt 

    FROM nres.property_house  as h
   
    UNION 
   
    SELECT l.property_id,l.property_type, l.property_name,l.listed_for,l.district,l.municipality,l.area_name,l.price,l.property_image,l.views, l.createdAt 
  
  
    FROM nres.property_land as l 
    
    UNION
   
    SELECT a.property_id,a.property_type, a.property_name, a.listed_for,a.district, a.municipality,a.area_name,a.price,a.property_image,a.views, a.createdAt 
  
    FROM nres.property_apartment as a 
  `;

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
  createPropertyView();

  return (PropertyView = sequelize.define(
    "property_view_client",
    {
      property_id: {
        type: DataTypes.INTEGER,
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
        type:DataTypes.DECIMAL(12,2),
      },
      property_image:{
        type:DataTypes.JSON
      },
      views:{
        type:DataTypes.INTEGER
      },

      createdAt: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  ));
}

function propertyShootScheduleModel(sequelize, DataTypes) {
  return (propertyShootSchedule = sequelize.define(
    "property_shoot_schedule",
    {
      property_id: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      property_type: {
        type: DataTypes.ENUM("apartment", "land", "house"),
      },
      shoot_status: {
        type: DataTypes.ENUM("scheduled", "completed", "read_to_post"),
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  ));

  // return PropertyShootSchedule = sequelize.define('property_shoot_schedule',{
  //   property_type:{
  //      property_type:{
  //       type:DataTypes.ENUM('apartment','land','house')
  //    },
  //    shoot_status:{
  //      type:DataTypes.ENUM("scheduled","completed","read_to_post")
  //    },
  //    scheduled_date:{
  //      type:DataTypes.DATE,
  //      allowNull:false
  //    }
  //   }
  // })
}

function propertyFieldVisitRequestModel(sequelize,DataTypes){

  return sequelize.define('property_field_visit_request',{
    field_visit_id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_customer',
        key:'customer_id'
      }
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
    visit_status:{
      type:DataTypes.ENUM('not schedule','schedule')
    }


  },
  { 
    hooks:{
      beforeCreate:async (instance,options)=>{
        const {property_id,property_type} = instance;

        //const modelName = capitalizeFirstLetter(property_type);
        const modelName = `property_${property_type}`
        
        console.log(sequelize.models[modelName])
        // check property exists for not with property type and 
        const property = await sequelize.models[modelName].findOne({
          where:{
            property_id:property_id,
            property_type:property_type
          }
        })

        if(!property){
          throw new sequelize.Sequelize.ValidationError(`The provided property_id and property_type do not match any record in property_${property_type} table.`)
          
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
      }
    },
    comment:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true,
      },
    },

    staff_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_staff',
        key:'staff_id'
      }
      
    },
    superAdmin_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'user_superAdmin',
        key:'superAdmin_id'
      }
    }



  },{
    hooks:{
      beforeValidate: (instance)=>{
        if(instance.staff_id && instance.superAdmin_id){
          throw new sequelize.ValidationError('Only one of staff_id or superAdmin_id can be set.')
        }
        if (!instance.staff_id && !instance.superAdmin_id) {
          throw new sequelize.ValidationError('Either staff_id or superAdmin_id must be set.');
        }
      }
    },
      freezeTableName:true
    
  })
  
}


module.exports = {
  propertyIdTrackerModel,
  propertyViewAdminModel,
  propertyShootScheduleModel,
  propertyViewClientModel,
  propertyFieldVisitRequestModel, 
  propertyFieldVisitCommentModel
};
