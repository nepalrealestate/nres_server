const db = require("../../model.index");
const Land = db.PropertyModel.Land;
const PendingLand = db.PropertyModel.PendingLand
const LandAds = db.PropertyModel.LandAds
const LandComment = db.PropertyModel.LandComment
const LandFeedback = db.PropertyModel.LandFeedback
const LandViews = db.PropertyModel.LandViews



async function insertPendingLand(land){
    return await PendingLand.create(land)
}

async function getLand(condition,limit,offset){
    return await Land.findAll({
        where:condition,
        attributes:[ 'property_id','property_name','listed_for','price','views'],
        limit:limit,
        offset:offset
    })
}

async function getLandByID(property_id){
    return await Land.findByPk(property_id);
}

async function getPendingLand(condition,limit,offset){
    return await PendingLand.findAll({
        where : condition,
        attributes:[ 'property_id','property_name','listed_for','price','views'],
        limit:limit,
        offset:offset
    })
 }


 async function getPendingLandByID(property_id){
    return await PendingLand.findOne({
        where:{property_id:property_id}

    })
 }



 async function approveLand(staff_id,property_id){

    let transaction ; 

    try {
        transaction  = await db.sequelize.transaction();

        // find latest property id
        const propertyId = await db.PropertyModel.PropertyIdTracker.findOne({where:{id:1}});
        
        console.log(propertyId);
        const newPropertyId = propertyId.dataValues.property_id;
       
        const pendingLand = await PendingLand.findOne({where:{property_id:property_id},transaction})

        await Land.create({...pendingLand.get(),property_id:newPropertyId, staff_id: staff_id },{transaction});

         // Increment property_id in PropertyIdTracker
         const propertyIdTracker = await db.PropertyModel.PropertyIdTracker.findByPk(1, { transaction });
         propertyIdTracker.property_id += 1;
         await propertyIdTracker.save({ transaction });

         // delete from pending Land\
         await PendingLand.destroy({where:{property_id},transaction});

         //insert into Land ads

         await LandAds.create({property_id:newPropertyId},{transaction});

         await transaction.commit();
        
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
 }




 async function insertLandFeedback(property_id,customer_id,feedback){
    return await LandFeedback.create({
        property_id:property_id,
        customer_id:customer_id,
        feedback:feedback
    })
 }



 async function updateLandAds(ads_status,property_id){
    return await LandAds.update({ads_status:ads_status},{where:{property_id:property_id}})
}

async function insertLandComment(property_id,staff_id,super_admin_id,comment,isPrivate){
    return await LandComment.create({
        property_id:property_id,
        staff_id:staff_id,
        super_admin_id:super_admin_id,
        comment:comment,
        is_private:isPrivate
    })
}

async function getLandComment(property_id,super_admin_id=null){
    return await  LandComment.findAll({
        where:{
            property_id:property_id,
            super_admin_id:super_admin_id
        }
    })
}


async function updateLandViews(property_id,latitude,longitude){
    //update views in Apartment table and Land views  Table
    let transaction ;


    try {
        transaction = await db.sequelize.transaction();
        // create new views 
        await LandViews.create({property_id,latitude,longitude},{transaction});

        // update Apartment views
        await Land.increment('views', { by: 1, where: { property_id: property_id }, transaction });

        await transaction.commit();
        return;

    } catch (error) {

        await transaction.rollback();
        throw error;
    }

}



module.exports = {
    insertPendingLand,
    getLand,
    getLandByID,
    getLandComment,
    getPendingLand,
    getPendingLandByID,
    insertLandFeedback,
    insertLandComment,
    updateLandAds,
    approveLand,
    updateLandViews
}