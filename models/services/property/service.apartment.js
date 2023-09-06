
const db = require("../../model.index");
const { getPropertyId, updatePropertyId } = require("./service.property");

const propertyService = require("../service.utils").propertyServiceUtility();

const Apartment = db.PropertyModel.Apartment;
const PendingApartment = db.PropertyModel.PendingApartment;
const ApartmentAds = db.PropertyModel.ApartmentAds;
const ApartmentFeedback = db.PropertyModel.ApartmentFeedback;
const ApartmentComment = db.PropertyModel.ApartmentComment
const ApartmentViews = db.PropertyModel.ApartmentViews
const ApartmentShootSchedule = db.PropertyModel.ApartmentShootSchedule;
const RequestedApartment = db.PropertyModel.RequestedApartment;


async function insertPendingApartment(apartment){

    return await PendingApartment.create(apartment);

}

async function insertApartment(apartment){
    
    

    let transaction ; 

    try {
        transaction  = await db.sequelize.transaction();

        const property_id = await getPropertyId();
        

       const createdApartment =  await Apartment.create({
            property_id:property_id,
            ...apartment
        });
        //insert into apartments ads
        await ApartmentAds.create({property_id:newPropertyId},{transaction})
        await updatePropertyId(transaction);
        transaction.commit();
        return createdApartment;

    //return await  Apartment.create(apartment);
}catch(error){
    transaction.rollback();
    throw error;
    
}
}


async function getApartment(condition){



    return await propertyService.getProperty(condition,Apartment)


    // return await Apartment.findAll({
    //     where:condition,
    //     attributes:[ 'property_id','property_name','listed_for','price','views'],
    //     limit:limit,
    //     offset:offset
    // })
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
        attributes:[ 'property_id','property_name','listed_for','price','views'],
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


async function updateApartmentAds(platform,ads_status,property_id){
    return await ApartmentAds.update({[platform]:ads_status},{where:{property_id:property_id}})
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


async function insertRequestedApartment(data){
    return await RequestedApartment.create(data)
}

async function getRequestedApartment(condition){

   return await propertyService.getProperty(condition,RequestedApartment)
    
}


async function insertApartmentShootSchedule(property_id,shootStatus,datetime){
    return await ApartmentShootSchedule.create({
        property_id:property_id,
        shoot_status:shootStatus,
        date:datetime,
        
    })
}

async function getApartmentShootScheduleById(property_id){
    
    


}

module.exports = {insertApartment,insertPendingApartment,getApartment,getApartmentByID,getPendingApartment,approveApartment,getPendingApartmentByID,insertApartmentFeedback,updateApartmentAds,insertApartmentComment,getApartmentComment,updateApartmentViews,insertRequestedApartment,getRequestedApartment,insertApartmentShootSchedule};