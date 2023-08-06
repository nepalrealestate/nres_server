
const { where } = require("sequelize");
const db = require("../../model.index");
const Apartment = db.PropertyModel.Apartment;
const PendingApartment = db.PropertyModel.PendingApartment;
const ApartmentAds = db.PropertyModel.ApartmentAds;
const ApartmentFeedback = db.PropertyModel.ApartmentFeedback;
const ApartmentComment = db.PropertyModel.ApartmentComment
const ApartmentViews = db.PropertyModel.ApartmentViews

async function insertPendingApartment(apartment){

    return await PendingApartment.create(apartment);

}


async function getApartment(condition,limit,offset){
    return await Apartment.findAll({
        where:condition,
        attributes:[ 'property_id','property_name','listed_for','price','views'],
        limit:limit,
        offset:offset
    })
}

async function getApartmentByID(property_id){

     const data = await Apartment.findByPk(property_id);
     return data!==null?data.get():null;
    // console.log(property_id)
    // const apartment = await Apartment.findOne({where:{property_id}});
    // console.log(apartment)
    // return apartment;
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
    return await ApartmentComment.create({
        property_id:property_id,
        staff_id:staff_id,
        super_admin_id:super_admin_id,
        comment:comment,
        is_private:isPrivate
    })
}

async function getApartmentComment(property_id,super_admin_id=null){
    return await ApartmentComment.findAll({
        where:{
            property_id:property_id,
            super_admin_id:super_admin_id
        }
    })
}


async function updateApartmentViews(property_id,latitude,longitude){
    //update views in Apartment table and ApartmentViewsCount Table
    let transaction ;


    try {
        transaction = await db.sequelize.transaction();
        // create new views 
        await ApartmentViews.create({property_id,latitude,longitude},{transaction});

        // update Apartment views
        await Apartment.increment('views', { by: 1, where: { property_id: property_id }, transaction });

        await transaction.commit();
        return;

    } catch (error) {

        await transaction.rollback();
        throw error;
    }

}



module.exports = {insertPendingApartment,getApartment,getApartmentByID,getPendingApartment,approveApartment,getPendingApartmentByID,insertApartmentFeedback,updateApartmentAds,insertApartmentComment,getApartmentComment,updateApartmentViews};