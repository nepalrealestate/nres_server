const db = require("../../model.index");
const ServiceProvider = db.ServiceModel.ServiceProvider
const ServiceProviderRating = db.ServiceModel.ServiceProviderRating


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
    if(condition.search){
        whereConditions[db.Op.or] = [
            {
                name:{[db.Op.like]:condition.search},
                service_type:{[db.Op.like]:condition.search},
                province:{[db.Op.like]:condition.search},
                district:{[db.Op.like]:condition.search},
                municipality:{[db.Op.like]:condition.search},

            }
        ]

    }
    const data = await ServiceProvider.findAll({
        where: whereConditions,
        limit: limit,
        offset: offset,
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



module.exports = {
    registerServiceProvider,
    getServiceProvider,
    getServiceProviderByID,
    getPendingServiceProvider,
    verifyServiceProvider,
    deleteServiceProvider,
    insertServiceProviderRating,
    updateServiceProvider
};