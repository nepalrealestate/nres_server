const sequelize = require("../db.config");
const {DataTypes,Op} = require('sequelize');




db = {};
db.sequelize = sequelize;
db.Op  = Op


// notification
db.NotificationModel = {
    NotifyAdmin :require('./notification/model.notification').notificationModel(sequelize,DataTypes)
};



db.UserModel = {
    //Agent: require('./users/model.agent').agentModel(sequelize, DataTypes),
    //Staff: require('./users/model.staff').staffModel(sequelize, DataTypes),
    //Customer: require('./users/model.customer').customerModel(sequelize, DataTypes),
    ////SuperAdmin:require('./users/model.superAdmin').superAdminModel(sequelize,DataTypes),
    //AgentRating:require('./users/model.agent').agentRatingModel(sequelize,DataTypes),
    //AgentInfo :require('./users/model.agent').agentInfoModel(sequelize,DataTypes),

    User : require('./users/model.user').userAccountModel(sequelize,DataTypes),
    CustomerProfile:require('./users/model.user').customerProfileModel(sequelize,DataTypes),
    AgentProfile:require('./users/model.user').agentProfileModel(sequelize,DataTypes),
    AgentRating: require('./users/model.user').agentRatingModel(sequelize,DataTypes),
    Admin : require('./users/model.admin').adminAccountModel(sequelize,DataTypes),
    StaffProfile : require('./users/model.admin').staffProfileModel(sequelize,DataTypes)
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
    ApartmentViewsCount:require('./property/model.apartment').apartmentViewsCountModel(sequelize,DataTypes),
    HouseViews:require('./property/model.house').houseViewsModel(sequelize,DataTypes),
    HouseViewsCount : require("./property/model.house").houseViewsCountModel(sequelize,DataTypes),
    LandViews : require('./property/model.land').landViewsModel(sequelize,DataTypes),
    LandViewsCount : require('./property/model.land').landViewsCountModel(sequelize,DataTypes),

    //property shoot schedule
    // ApartmentShootSchedule   : require('./property/model.apartment').apartmentShootScheduleModel(sequelize,DataTypes),
    // HouseShootSchedule  : require("./property/model.house").houseShootScheduleModel(sequelize,DataTypes),
    // LandShootSchedule  : require("./property/model.land").landShootScheduleModel(sequelize,DataTypes),


    //Requested Property
    RequestedProperty:require('./property/model.property').requestedPropertyModel(sequelize,DataTypes),
  

    PropertyShootSchedule : require('./property/model.property').propertyShootScheduleModel(sequelize,DataTypes),
    PropertyShootScheduleComment: require("./property/model.property").propertyShootScheduleCommentModel(sequelize,DataTypes),

    PropertyFieldVisitRequest : require('./property/model.property').propertyFieldVisitRequestModel(sequelize,DataTypes),
    PropertyFieldVisitComment : require('./property/model.property').propertyFieldVisitCommentModel(sequelize,DataTypes),
    PropertyFieldVisitOTP : require('./property/model.property').propertyFieldVisitOTPModel(sequelize,DataTypes),
    PropertyFieldVisit : require('./property/model.property').propertyFieldVisit(sequelize,DataTypes),

    //HomeLoan : require('./property/model.house').homeLoanModel(sequelize,DataTypes),
    HomeLoan : require('./property/model.property').homeLoanModel(sequelize,DataTypes),

    FavouriteProperty : require('./property/model.property').favouritePropertyModel(sequelize,DataTypes),
    
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

};

db.BlogModel = {
    Blog : require('./blog/model.blog').blogModel(sequelize,DataTypes),
}

db.AdsModel = {
    Ads:require('./ads/model.ads').adsModel(sequelize,DataTypes)
}

db.ContactModel = {
    Contact:require('./contact/model.contact').contactModel(sequelize,DataTypes)
}

db.VideoCarouselModel = {
    VideoCarousel:require("./videoCarousel/model.videoCarousel").videoCarouselModel(sequelize,DataTypes)
}

db.TestimonialModel = {
    Testimonial:require("./testimonial/model.testimonial").testimonialModel(sequelize,DataTypes)

}


// views 
db.Views={

    PropertyViewAdmin:require("./property/model.property").propertyViewAdminModel(sequelize,DataTypes),
    PropertyViewClient :require("./property/model.property").propertyViewClientModel(sequelize,DataTypes),
}




//-----------------Relation-------------------------------

// //agent relation to agent rating
// db.UserModel.Agent.hasMany(db.UserModel.AgentRating,{foreignKey:'agent_id'});
// db.UserModel.AgentRating.belongsTo(db.UserModel.Agent,{foreignKey:'agent_id'});
// //agent relation to agent Info Table
// db.UserModel.Agent.hasOne(db.UserModel.AgentInfo,{as:'agentInfo',foreignKey:'agent_id'});
// db.UserModel.AgentInfo.belongsTo(db.UserModel.Agent,{foreignKey:'agent_id'});

// //customer relation to agent rating
// db.UserModel.Customer.hasMany(db.UserModel.AgentRating,{foreignKey:'customer_id'});
// db.UserModel.AgentRating.belongsTo(db.UserModel.Customer,{foreignKey:'customer_id'});






// // Relations
// // house -> agent,customer,staff
// // house ->agent
// db.PropertyModel.House.belongsTo(db.UserModel.Agent,{foreignKey:'agent_id'});
// db.UserModel.Agent.hasMany(db.PropertyModel.House,{foreignKey:'agent_id'});
// //house ->staff
// db.PropertyModel.House.belongsTo(db.UserModel.Staff,{foreignKey:'staff_id'});
// db.UserModel.Staff.hasMany(db.PropertyModel.House,{foreignKey:'staff_id'});
// // house->customer
// db.PropertyModel.House.belongsTo(db.UserModel.Customer,{foreignKey:'customer_id'});
// db.UserModel.Customer.hasMany(db.PropertyModel.House,{foreignKey:'customer_id'});

// user Account with customer profile and agent profile
db.UserModel.User.hasOne(db.UserModel.CustomerProfile,{foreignKey:'user_id'});
db.UserModel.CustomerProfile.belongsTo(db.UserModel.User,{foreignKey:'user_id'});

db.UserModel.User.hasOne(db.UserModel.AgentProfile,{foreignKey:'user_id'});
db.UserModel.AgentProfile.belongsTo(db.UserModel.User,{foreignKey:'user_id'});



// user and admin relation with property table;
// user relation with house
db.UserModel.User.hasMany(db.PropertyModel.House,{foreignKey:'owner_id'});
db.PropertyModel.House.belongsTo(db.UserModel.User,{as:'owner',foreignKey:'owner_id'})


db.UserModel.User.hasMany(db.PropertyModel.Apartment,{foreignKey:'owner_id'});
db.PropertyModel.Apartment.belongsTo(db.UserModel.User,{as:'owner',foreignKey:'owner_id'});

db.UserModel.User.hasMany(db.PropertyModel.Land,{foreignKey:'owner_id'});
db.PropertyModel.Land.belongsTo(db.UserModel.User,{as:'owner',foreignKey:'owner_id'});


// user relation with requested property
db.UserModel.User.hasMany(db.PropertyModel.RequestedProperty,{foreignKey:'user_id'});
db.PropertyModel.RequestedProperty.belongsTo(db.UserModel.User,{as:'request_by',foreignKey:'user_id'});

//user/seller relation with property;
db.UserModel.User.hasMany(db.Views.PropertyViewClient,{foreignKey: 'owner_id'});
db.Views.PropertyViewClient.belongsTo(db.UserModel.User,{as:'owner',foreignKey: 'owner_id'});

//admin relation with house
db.UserModel.Admin.hasMany(db.PropertyModel.House,{foreignKey:'approved_by'});
db.PropertyModel.House.belongsTo(db.UserModel.Admin,{foreignKey:'approved_by'});

// property and views Model and views count
// apartment to views model and views count
db.PropertyModel.Apartment.hasMany(db.PropertyModel.ApartmentViews,{foreignKey:'property_id'});
db.PropertyModel.ApartmentViews.belongsTo(db.PropertyModel.Apartment,{foreignKey:'property_id'});

db.PropertyModel.Apartment.hasOne(db.PropertyModel.ApartmentViewsCount,{as:'apartmentViews',foreignKey:'property_id'});
db.PropertyModel.ApartmentViewsCount.belongsTo(db.PropertyModel.Apartment,{foreignKey:'property_id'});

// house to views model and views count
db.PropertyModel.House.hasMany(db.PropertyModel.HouseViews,{foreignKey:'property_id'});
db.PropertyModel.HouseViews.belongsTo(db.PropertyModel.House,{foreignKey:'property_id'});

db.PropertyModel.House.hasOne(db.PropertyModel.HouseViewsCount,{as:'houseViews',foreignKey:'property_id'});
db.PropertyModel.HouseViewsCount.belongsTo(db.PropertyModel.House,{foreignKey:'property_id'});

//land to views and views count
db.PropertyModel.Land.hasMany(db.PropertyModel.LandViews,{foreignKey:'property_id'});
db.PropertyModel.LandViews.belongsTo(db.PropertyModel.Land,{foreignKey:'property_id'});

db.PropertyModel.Land.hasOne(db.PropertyModel.LandViewsCount,{as:'landViews',foreignKey:'property_id'});
db.PropertyModel.LandViewsCount.belongsTo(db.PropertyModel.Land,{foreignKey:'property_id'});

// property field visit request with user_userAccount;
db.UserModel.User.hasMany(db.PropertyModel.PropertyFieldVisitRequest,{foreignKey:'user_id'});
db.PropertyModel.PropertyFieldVisitRequest.belongsTo(db.UserModel.User,{as:'user',foreignKey:'user_id'})
//property field visit rquest relation with field visit otp;
db.PropertyModel.PropertyFieldVisitRequest.hasOne(db.PropertyModel.PropertyFieldVisitOTP,{foreignKey:'field_visit_id'});
db.PropertyModel.PropertyFieldVisitOTP.belongsTo(db.PropertyModel.PropertyFieldVisitRequest,{foreignKey:'field_visit_id'});




// Admin Account Relation With Property Comment;
db.UserModel.Admin.hasMany(db.PropertyModel.ApartmentComment,{foreignKey:'admin_id'});
db.PropertyModel.ApartmentComment.belongsTo(db.UserModel.Admin,{foreignKey:'admin_id'});

db.UserModel.Admin.hasMany(db.PropertyModel.HouseComment,{foreignKey:'admin_id'});
db.PropertyModel.HouseComment.belongsTo(db.UserModel.Admin,{foreignKey:'admin_id'});

db.UserModel.Admin.hasMany(db.PropertyModel.LandComment,{foreignKey:'admin_id'});
db.PropertyModel.LandComment.belongsTo(db.UserModel.Admin,{foreignKey:'admin_id'});


// User Account Associate with Requested Property;
db.UserModel.User.hasMany(db.PropertyModel.RequestedProperty,{foreignKey:'user_id'});
db.PropertyModel.RequestedProperty.belongsTo(db.UserModel.User,{as:'user',foreignKey:'user_id'});


// User - Admin / user Relation their profile data;
db.UserModel.Admin.hasOne(db.UserModel.StaffProfile,{foreignKey:'admin_id'});
db.UserModel.StaffProfile.belongsTo(db.UserModel.Admin,{foreignKey:'admin_id'});

//  Admin Relation with property shoot shoot schedule comment;
db.UserModel.Admin.hasMany(db.PropertyModel.PropertyShootScheduleComment,{foreignKey:'admin_id'});
db.PropertyModel.PropertyShootScheduleComment.belongsTo(db.UserModel.Admin,{as: 'admin',foreignKey:'admin_id'});


// user/admin relation to chat
db.UserModel.User.hasMany(db.ChatModel.CustomerChatList, {foreignKey: 'user_id'});
db.ChatModel.CustomerChatList.belongsTo(db.UserModel.User, {as: 'customer', foreignKey: 'user_id'});



// chat list relation to chat
// db.ChatModel.CustomerChatList.hasMany(db.ChatModel.CustomerChat,{foreignKey:'user_id'})
// db.ChatModel.CustomerChat.belongsTo(db.ChatModel.CustomerChatList,{as:'chat_customers',foreignKey:'user_id'})


module.exports = db;