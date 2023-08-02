
const db = require("../../model.index");
const Apartment = db.PropertyModel.Apartment;
const PendingApartment = db.PropertyModel.PendingApartment;
const ApartmentAds = db.PropertyModel.ApartmentAds;
const ApartmentFeedback = db.PropertyModel.ApartmentFeedback;


async function insertPendingApartment(apartment){

    return await PendingApartment.create(apartment);

}


async function getApartment(condition,limit,offset){
    return await Apartment.findAll({
        where:condition,
        attributes:[ 'property_id','property_name','listed_for','price,views'],
        limit:limit,
        offset:offset
    })
}

async function getApartmentByID(property_id){
    return await Apartment.findByPk(property_id)
}

async function getPendingApartment(condition,limit,offset){
    return await PendingApartment.findAll({
        where : condition,
        attributes:[ 'property_id','property_name','listed_for','price,views'],
        limit:limit,
        offset:offset
    })
}


async function getPendingApartmentByID(property_id){
    return await PendingApartment.findOne({
        where:{property_id:property_id}

    })
}

async function approveApartment(staff_id,property_id){
    let transaction ; 

    try {
        transaction  = await db.sequelize.transaction();

        // find latest property id
        const propertyId = await db.PropertyModel.PropertyIdTracker.findOne({where:{id:1}});
        
        console.log(propertyId);
        const newPropertyId = propertyId.dataValues.property_id;
       
        const pendingApartment = await PendingApartment.findOne({where:{property_id:property_id},transaction})

        await Apartment.create({...pendingApartment.get(),property_id:newPropertyId, staff_id: staff_id },{transaction});

        // Increment property_id in PropertyIdTracker
        const propertyIdTracker = await db.PropertyModel.PropertyIdTracker.findByPk(1, { transaction });
        propertyIdTracker.property_id += 1;
        await propertyIdTracker.save({ transaction });

        // Delete from PendingApartment
        await PendingApartment.destroy({ where: { property_id }, transaction });
        
        //insert into apartments ads
        await ApartmentAds.create({property_id:newPropertyId},{transaction})

        await transaction.commit();

    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
}


async function insertApartmentFeedback(property_id,customer_id,feedback){
    return await ApartmentFeedback.create({
        property_id:property_id,
        customer_id:customer_id,
        feedback:feedback
    })
}


async function updateApartmentAds(ads_status,property_id){
    return await ApartmentAds.update({ads_status:ads_status},{where:{property_id:property_id}})
}

async function insertApartmentComment(property_id,staff_id,super_admin_id,comment,isPrivate){
    
}


module.exports = {insertPendingApartment,getApartment,getApartmentByID,getPendingApartment,approveApartment,getPendingApartmentByID,insertApartmentFeedback,updateApartmentAds};