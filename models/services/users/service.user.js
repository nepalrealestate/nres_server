const db = require("../../model.index");

const User = db.UserModel.User;
const CustomerProfile = db.UserModel.CustomerProfile;
const AgentProfile = db.UserModel.AgentProfile;

async function registerUser(data, options = {}) {
    console.log("register user", data);
    const user = await User.create({
        user_type: data.user_type,
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password
    }, options)
    if (user) {
        user.id = user.user_id;

    }

    return user;
}



async function getUser(condition, limit, offset) {

    let orderConditions = [["createdAt", "DESC"]];
    let whereConditions = {};
    let search;
    if (condition.search) {
        search = condition.search;
        whereConditions[db.Op.or] = [
            { name: { [db.Op.like]: `%${search}%` } },
            { email: { [db.Op.like]: `%${search}%` } },
            { phone_number: { [db.Op.like]: `%${search}%` } },
        ];
    }

    whereConditions.user_type = condition.user_type;

    return await User.findAndCountAll({
        where: whereConditions,
        attributes: ['user_id', 'name', 'email', 'phone_number', 'user_type'],
        limit: limit,
        offset: offset,
        order:orderConditions,
        raw:true
    })
}



async function findUserByEmail(user_type = 'customer', email) {
    return await User.findOne({
        where: { user_type: user_type, email: email },
        attributes: [['user_id', 'id'], 'user_type', 'name', 'email', 'password'],
    })
}

// first object where condition - second attributes array
async function findUserByID(user_type = 'customer', id, attributes = null) {
    return await User.findOne({
        where: { user_type: user_type, user_id: id },
        attributes: attributes
    })
}

async function deleteUser(user_id) {
    return await User.destroy({
        where: { user_id: user_id }
    })
}

async function getBuyer(condition,limit,offset ,attributes = null) {
    let orderConditions = [["createdAt", "DESC"]];
    let whereConditions = {};
    let search;
    if (condition.search) {
        search = condition.search;
        whereConditions[db.Op.or] = [
            { name: { [db.Op.like]: `%${search}%` } },
            { email: { [db.Op.like]: `%${search}%` } },
            { phone_number: { [db.Op.like]: `%${search}%` } },
        ];
    }

    whereConditions.user_type = condition.user_type;
    return await User.findAndCountAll({
        where: whereConditions,
        attributes: attributes,
        include: [{
            model: db.PropertyModel.RequestedProperty,
            required: true,
            attributes: ['property_type']

        }],
        limit: limit,
        offset: offset,
        order:orderConditions,
        raw:true,
    })
}
async function getBuyerByID(user_id) {
    return await User.findOne({
        where: { user_id: user_id },
        attributes: ['user_id', 'name', 'email', 'phone_number'],
        include: [{
            model: db.PropertyModel.RequestedProperty,
            required: true,
            //attributes:['property_type']

        }]
    })
}

async function getSeller(condition,limit,offset) {
    let orderConditions = [["createdAt", "DESC"]];
    let whereConditions = {};
    let search;
    if (condition.search) {
        search = condition.search;
        whereConditions[db.Op.or] = [
            { name: { [db.Op.like]: `%${search}%` } },
            { email: { [db.Op.like]: `%${search}%` } },
            { phone_number: { [db.Op.like]: `%${search}%` } },
        ];
    }

    whereConditions.user_type = condition.user_type;

    return await User.findAndCountAll({
        where: whereConditions,
        attributes: ['user_id', 'name', 'email', 'phone_number'],
        include: [{
            model: db.Views.PropertyViewClient,
            required: true,
            attributes: ['property_type']
        }],
        order:orderConditions,
        raw:true
    })
}

async function getSellerByID(user_id) {
    return await User.findOne({
        where: { user_id: user_id },
        attributes: ['user_id', 'name', 'email', 'phone_number'],
        include: [{
            model: db.Views.PropertyViewClient,
            required: true,
            attributes: ['property_type', 'property_id', 'listed_for', 'price', 'province', 'district', 'municipality', 'area_name']

        }]
    })
}


async function updateCustomerPassword(user_id, hashPassword) {
    return await User.update({ password: hashPassword }, {
        where: { user_type: "customer", user_id: user_id }
    })
}

async function updateAgentPassword(agent_id, hashPassword) {
    return await User.update({ password: hashPassword }, {
        where: { user_type: "agent", user_id: agent_id }
    })
}


async function getCustomerProfile(condition, attributes = null) {
    return await CustomerProfile.findOne({
        where: condition,
        attributes: attributes
    })
}

async function getCustomerPropertyLimit(user_id) {
    return await CustomerProfile.findOne({
        where: { user_id: user_id },
        attributes: ['property_limit'],
        raw: true
    })
}

async function isAgentVerified(user_id) {
    return await AgentProfile.findOne({
        where: { user_id: user_id },
        attributes: ['verified'],
        raw: true,
    })
}






module.exports = {
    registerUser,
    findUserByEmail,
    findUserByID,
    getUser,
    getBuyer,
    getSeller,
    getSellerByID,
    updateCustomerPassword,
    updateAgentPassword,
    getCustomerProfile,
    getCustomerPropertyLimit,
    isAgentVerified
}