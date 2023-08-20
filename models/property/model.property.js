
function propertyIdTrackerModel(sequelize,DataTypes){
   const PropertyIdTracker = sequelize.define('property_id_tracker',{
     id:{
      type:DataTypes.INTEGER,
      defaultValue:1,
      primaryKey:true,
      allowNull:false
     },
     property_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },{
    hooks:{
      afterSync : async ()=>{
        await PropertyIdTracker.findOrCreate({
          where: { id: 1 },
          defaults: { property_id: 1 }
        });
      }
    }
  }
  )
  return PropertyIdTracker;
}



// property views

function propertyViewAdminModel(sequelize,DataTypes){

  async function createPropertyViewAdmin(){

  try {
     sequelize.query(`
 
     CREATE OR REPLACE VIEW property_view_admin AS

     SELECT   h.property_id,h.property_type, h.property_name,h.listed_for, h.district, h.municipality,h.ward, h.createdAt ,
     ha.twitter,ha.tiktok,ha.instagram,ha.facebook,ha.youtube
    FROM nres.property_house as h INNER JOIN nres.property_house_ads as ha ON h.property_id = ha.property_id
   
    UNION 
   
    SELECT l.property_id,l.property_type, l.property_name,l.listed_for,  l.district, l.municipality,l.ward, l.createdAt ,
     la.twitter,la.tiktok,la.instagram,la.facebook,la.youtube

    FROM nres.property_land as l INNER JOIN nres.property_land_ads as la ON l.property_id = la.property_id
    
    UNION
   
    SELECT a.property_id,a.property_type, a.property_name, a.listed_for, a.district, a.municipality,a.ward, a.createdAt ,
     aa.twitter,aa.tiktok,aa.instagram,aa.facebook,aa.youtube
    FROM nres.property_apartment as a INNER JOIN nres.property_apartment_ads as aa ON a.property_id = aa.property_id;
     `)
   } catch (error) {
     console.log(error)
   }
  }

 // createPropertyViewAdmin();

  setTimeout(createPropertyViewAdmin,50000);

 

return  PropertyViewAdmin = sequelize.define('property_view_admin',{
  property_id:{
    type:DataTypes.INTEGER
  },
  property_type:{
    type:DataTypes.STRING
  },
  property_name:{
    type:DataTypes.STRING
  },
  listed_for:{
    type:DataTypes.STRING,
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
  twitter:{
    type:DataTypes.STRING
  },
  tiktok:{
    type:DataTypes.STRING
  },
  instagram:{
    type:DataTypes.STRING
  },
  facebook:{
    type:DataTypes.STRING
  },
  youtube:{
    type:DataTypes.STRING
  }

},{
  freezeTableName:true,
  timestamps:false
})

}




module.exports = {
  propertyIdTrackerModel,
  propertyViewAdminModel
};
