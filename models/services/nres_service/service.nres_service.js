const db = require("../../model.index");
const ServiceProvider = db.ServiceModel.ServiceProvider
const ServiceProviderRating = db.ServiceModel.ServiceProviderRating
const ServiceProviderRequest = db.ServiceModel.ServiceProviderRequest


async function registerServiceProvider(data) {
    return await ServiceProvider.create(data);
}

async function updateServiceProvider(provider_id,data){
    return await ServiceProvider.update(data,{
        where:{
            id:provider_id
        }
    })
}

async function getServiceProvider(condition, limit, offset) {
    let whereConditions = {};
    if (condition.search) {
        location = condition.search;
        whereConditions[db.Op.or] = [
          {service_type: { [db.Op.like]: `%${location}%` } },
          { province: { [db.Op.like]: `%${location}%` } },
          { district: { [db.Op.like]: `%${location}%` } },
          { municipality: { [db.Op.like]: `%${location}%` } },
        ];
      }
    console.log("THis is search condition",whereConditions)
    const data = await ServiceProvider.findAll({
        where: whereConditions,
        limit: limit,
        offset: offset,
        raw: true

    })

    return data;

}

async function getServiceProviderWithOutPhoneNumber(condition, limit, offset) {
    let whereConditions = {};
    if (condition.search) {
        location = condition.search;
        whereConditions[db.Op.or] = [
          {service_type: { [db.Op.like]: `%${location}%` } },
          { province: { [db.Op.like]: `%${location}%` } },
          { district: { [db.Op.like]: `%${location}%` } },
          { municipality: { [db.Op.like]: `%${location}%` } },
        ];
    }
    whereConditions.status = "approved"
    console.log("THis is search condition",whereConditions)
    const data = await ServiceProvider.findAll({
        where: whereConditions,
        limit: limit,
        offset: offset,
        attributes: { exclude: ['phone_number'] },
        raw: true

    })

    return data;
}

async function getServiceProviderByID(provider_id) {
    const data = await ServiceProvider.findOne({
        where: {
            provider_id: provider_id
        },
       // raw: true
    })
    return data;
}


async function getPendingServiceProvider(condition, limit, offset) {
    condition.status = "pending"
    const data = await ServiceProvider.findAll({
        where: condition,
        limit: limit,
        offset: offset,
        raw: true
    })

    return data;
}


async function verifyServiceProvider(status, provider_id) {

    return await ServiceProvider.update({ status: status }, {
        where: {
            id: provider_id
        }
    })

}

async function deleteServiceProvider(provider_id) {
    return await ServiceProvider.destroy({
        where: {
            id: provider_id
        }
    })
}

async function insertServiceProviderRating(data) {
    return await ServiceProviderRating.create(data);
}


async function insertServiceProviderRequest(data){
    return await ServiceProviderRequest.create(data);

}


module.exports = {
    registerServiceProvider,
    getServiceProvider,
    getServiceProviderByID,
    getPendingServiceProvider,
    verifyServiceProvider,
    deleteServiceProvider,
    insertServiceProviderRating,
    updateServiceProvider,
    getServiceProviderWithOutPhoneNumber,
    insertServiceProviderRequest
};