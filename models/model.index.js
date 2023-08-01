const sequelize = require("../db.confing");
const {DataTypes} = require('sequelize');


db = {};
db.sequelize = sequelize;


db.UserModel = {
    Agent: require('./users/model.agent').agentModel(sequelize, DataTypes),
    Staff: require('./users/model.staff').staffModel(sequelize, DataTypes),
    Customer: require('./users/model.customer').customerModel(sequelize, DataTypes)
};

db.propertyModel = {
    House: require('./property/model.house').houseModel(sequelize, DataTypes),
    Apartment:require('./property/model.apartment').apartmentModel(sequelize,DataTypes),
    Land:require('./property/model.land').landModel(sequelize,DataTypes)
};







// Relations
// house -> agent,customer,staff
// house ->agent
db.propertyModel.House.belongsTo(db.UserModel.Agent,{foreignKey:'agent_id'});
db.UserModel.Agent.hasMany(db.propertyModel.House,{foreignKey:'agent_id'});
//house ->staff
db.propertyModel.House.belongsTo(db.UserModel.Staff,{foreignKey:'staff_id'});
db.UserModel.Staff.hasMany(db.propertyModel.House,{foreignKey:'staff_id'});
// house->customer
db.propertyModel.House.belongsTo(db.UserModel.Customer,{foreignKey:'customer_id'});
db.UserModel.Customer.hasMany(db.propertyModel.House,{foreignKey:'customer_id'});

module.exports = db;