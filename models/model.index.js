const sequelize = require("../db.confing");
const {DataTypes} = require('sequelize');


db = {};
db.sequelize = sequelize;


db.UserModel = {
    Agent: require('./users/model.agent').agentModel(sequelize, DataTypes),
    Staff: require('./users/model.staff').staffModel(sequelize, DataTypes),
    Customer: require('./users/model.customer').customerModel(sequelize, DataTypes),
    SuperAdmin:require('./users/model.superAdmin').superAdminModel(sequelize,DataTypes),
};

db.PropertyModel = {

    PropertyIdTracker : require('./property/model.property').propertyIdTrackerModel(sequelize,DataTypes),
    

    House: require('./property/model.house').houseModel(sequelize, DataTypes),
    Apartment:require('./property/model.apartment').apartmentModel(sequelize,DataTypes),
    Land:require('./property/model.land').landModel(sequelize,DataTypes),

   
    // pending property table
    PendingApartment:require('./property/model.apartment').pendingApartmentModel(sequelize,DataTypes),
    PendingHouse:require('./property/model.house').pendingHouseModel(sequelize,DataTypes),
    PendingLand:require('./property/model.land').pendingLandModel(sequelize,DataTypes),

    // property ads
    ApartmentAds: require('./property/model.apartment').apartmentAdsModel(sequelize,DataTypes),
    HouseAds:require('./property/model.house').houseAdsModel(sequelize,DataTypes),
    LandAds:require('./property/model.land').landAdsModel(sequelize,DataTypes),

    // property feedback by users
    ApartmentFeedback: require('./property/model.apartment').apartmentFeedbackModel(sequelize,DataTypes),
    HouseFeedback: require('./property/model.house').houseFeedbackModel(sequelize,DataTypes),
    LandFeedback: require('./property/model.land').landFeedbackModel(sequelize,DataTypes),

    // property comment for staff and admins
    ApartmentComment:require('./property/model.apartment').apartmentCommentModel(sequelize,DataTypes),
    HouseComment:require('./property/model.house').houseCommentModel(sequelize,DataTypes),
    LandComment :require('./property/model.land').landCommentModel(sequelize,DataTypes),

    //property views count 
    ApartmentViews: require('./property/model.apartment').apartmentViewsModel(sequelize,DataTypes),
    HouseViews:require('./property/model.house').houseViewsModel(sequelize,DataTypes)



   

};







// Relations
// house -> agent,customer,staff
// house ->agent
db.PropertyModel.House.belongsTo(db.UserModel.Agent,{foreignKey:'agent_id'});
db.UserModel.Agent.hasMany(db.PropertyModel.House,{foreignKey:'agent_id'});
//house ->staff
db.PropertyModel.House.belongsTo(db.UserModel.Staff,{foreignKey:'staff_id'});
db.UserModel.Staff.hasMany(db.PropertyModel.House,{foreignKey:'staff_id'});
// house->customer
db.PropertyModel.House.belongsTo(db.UserModel.Customer,{foreignKey:'customer_id'});
db.UserModel.Customer.hasMany(db.PropertyModel.House,{foreignKey:'customer_id'});

module.exports = db;