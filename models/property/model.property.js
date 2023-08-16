
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





module.exports = {
  propertyIdTrackerModel
};
