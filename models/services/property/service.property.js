
const db = require("../../model.index");
const PropertyAdminView = db.Views.PropertyViewAdmin;
const PropertyShootSchedule = db.PropertyModel.PropertyShootSchedule;
const PropertyViewClient = db.Views.PropertyViewClient;
const PropertyIdTracker = db.PropertyModel.PropertyIdTracker;

// get latest property insert id
async function getPropertyId(){
    const property_id =  await PropertyIdTracker.findOne({where:{id:1}});
    return property_id.dataValues.property_id;
}

async function updatePropertyId(transaction){
     try {
        const propertyIdTracker = await PropertyIdTracker.findByPk(1, { transaction });
    //     propertyIdTracker.property_id += 1;
    //  await propertyIdTracker.save({ transaction });
    await propertyIdTracker.increment('property_id', { by: 1, transaction });
     } catch (error) {
        throw error;
     }
     
}



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
        order:[
            ['createdAt', 'DESC']],
        limit:limit,
        offset:offset,
    })
}

async function getLatestPropertyPriorityLocation(condition,limit,offset){
    return await PropertyViewClient.findAll({
        where:condition,
        attributes:{exclude:['id']},
        order: [
            [db.sequelize.literal(`(CASE WHEN district='${condition.district}' THEN 1 ELSE 2 END)`), 'ASC'],
            ['createdAt', 'DESC']
          ],
        limit:limit,
        offset:offset
    })
}




module.exports = {getPropertyWithAds,insertPropertyShootSchedule,getPropertyShootSchedule,getProperty,getLatestPropertyPriorityLocation,getPropertyId,updatePropertyId}