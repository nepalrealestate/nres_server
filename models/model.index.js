const sequelize = require("../db.config");
const {DataTypes} = require('sequelize');
const { agentChatModel } = require("./chat/model.agentChat");


db = {};
db.sequelize = sequelize;


db.UserModel = {
    Agent: require('./users/model.agent').agentModel(sequelize, DataTypes),
    Staff: require('./users/model.staff').staffModel(sequelize, DataTypes),
    Customer: require('./users/model.customer').customerModel(sequelize, DataTypes),
    SuperAdmin:require('./users/model.superAdmin').superAdminModel(sequelize,DataTypes),
    AgentRating:require('./users/model.agent').agentRatingModel(sequelize,DataTypes),
    AgentInfo :require('./users/model.agent').agentInfoModel(sequelize,DataTypes)
};

db.ServiceModel={
    ServiceProvider:require('./nres_services/model.nres_service').serviceProviderModel(sequelize,DataTypes),


    ServiceProviderRating:require('./nres_services/model.nres_service').serviceProviderRatingModel(sequelize,DataTypes)
}


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
    HouseViews:require('./property/model.house').houseViewsModel(sequelize,DataTypes),
    LandViews : require('./property/model.land').landViewsModel(sequelize,DataTypes),


    //Requested Property
    RequestedApartment:require('./property/model.apartment').requestedApartmentModel(sequelize,DataTypes),
    //RequestedApartmentBy:require('./property/model.apartment').requestedApartmentByModel(sequelize,DataTypes),
    RequestedHouse : require('./property/model.house').requestedHouseModel(sequelize,DataTypes),
    RequestedLand : require('./property/model.land').requestedLandModel(sequelize,DataTypes)

};



//chat 
db.ChatModel={

    CustomerChat:require('./chat/model.customerChat').customerChatModel(sequelize,DataTypes),
    CustomerChatList:require('./chat/model.customerChat').customerChatListModel(sequelize,DataTypes),

    AgentChatModel:require('./chat/model.agentChat').agentChatModel(sequelize,DataTypes),
    AgentChatListModel:require('./chat/model.agentChat').agentChatListModel(sequelize,DataTypes),


    StaffChat : require('./chat/model.staffChat').staffChatModel(sequelize,DataTypes),
    StaffChatList : require('./chat/model.staffChat').staffChatListModel(sequelize,DataTypes),
    StaffChatGroup : require('./chat/model.staffChat').staffChatGroupModel(sequelize,DataTypes)

}



//-----------------Relation-------------------------------

//agent relation to agent rating
db.UserModel.Agent.hasMany(db.UserModel.AgentRating,{foreignKey:'agent_id'});
db.UserModel.AgentRating.belongsTo(db.UserModel.Agent,{foreignKey:'agent_id'});
//agent relation to agent Info Table
db.UserModel.Agent.hasOne(db.UserModel.AgentInfo,{as:'agentInfo',foreignKey:'agent_id'});
db.UserModel.AgentInfo.belongsTo(db.UserModel.Agent,{foreignKey:'agent_id'});

//customer relation to agent rating
db.UserModel.Customer.hasMany(db.UserModel.AgentRating,{foreignKey:'customer_id'});
db.UserModel.AgentRating.belongsTo(db.UserModel.Customer,{foreignKey:'customer_id'});






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