const db = require("../../model.index");
const ServiceProvider = db.ServiceModel.ServiceProvider
const ServiceProviderRating = db.ServiceModel.ServiceProviderRating


async function  registerServiceProvider(data){
    return await ServiceProvider.create(data);
}

async function getServiceProvider(condition,limit,offset){
    const data = await ServiceProvider.findAll({
        where:condition,
        limit:limit,
        offset:offset,
        raw:true

    })

    return data;

}


async function getPendingServiceProvider(condition,limit,offset){
    condition.status = "pending"
    const data = await ServiceProvider.findAll({
        where:condition,
        limit:limit,
        offset:offset,
        rew:true
    })

    return data;
}


async function verifyServiceProvider(status,provider_id){
    
   await ServiceProvider.update({status:status},{
    where:{
        provider_id:provider_id
    }
   })

}



module.exports = {registerServiceProvider,getServiceProvider,getPendingServiceProvider,verifyServiceProvider};