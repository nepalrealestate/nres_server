const db = require("../../model.index");
const PropertyAdminView = db.Views.PropertyViewAdmin;
const PropertyShootSchedule = db.PropertyModel.PropertyShootSchedule;
const PropertyViewClient = db.Views.PropertyViewClient;

async function getPropertyWithAds(condition,limit,offset){

    return await PropertyAdminView.findAll({
        where:condition,
        attributes: { exclude: ['id'] },
        order:['property_id'],
        limit:limit,
        offset:offset
    })

}

async function insertPropertyShootSchedule(property_id,property_type,shoot_status,shoot_date){
    return await PropertyShootSchedule.create({
        property_id:property_id,
        property_type:property_type,
        shoot_status:shoot_status,
        date:shoot_date
    })
}

async function getPropertyShootSchedule(condition,limit,offset){
    return PropertyShootSchedule.findAll({
        where:condition,
        limit:limit,
        offset:offset
    })
}

async function getProperty(condition,limit,offset){
    return await PropertyViewClient.findAll({
        where:condition,
        attributes: { exclude: ['id'] },
        order:[['createdAt', 'DESC']],
        limit:limit,
        offset:offset,
    })
}


module.exports = {getPropertyWithAds,insertPropertyShootSchedule,getPropertyShootSchedule,getProperty}