
const db = require("../../model.index");
const House = db.PropertyModel.House
const PendingHouse = db.PropertyModel.PendingHouse
const HouseAds = db.PropertyModel.HouseAds
const HouseFeedback = db.PropertyModel.HouseFeedback
const HouseComment = db.PropertyModel.HouseComment

 async function insertPendingHouse(house){
    return await House.create(house);
 }

 async function getHouse(condition,limit,offset){
    return await House.findAll({
        where:condition,
        attributes:[ 'property_id','property_name','listed_for','price,views'],
        limit:limit,
        offset:offset
    })
 }

 async function getHouseByID(property_id){
    return await House.findByPk(property_id)
 }

 async function getPendingHouse(condition,limit,offset){
    return await PendingHouse.findAll({
        where : condition,
        attributes:[ 'property_id','property_name','listed_for','price,views'],
        limit:limit,
        offset:offset
    })
 }


 async function getPendingHouseByID(property_id){
    return await PendingHouse.findOne({
        where:{property_id:property_id}

    })
 }



 async function approveHouse(staff_id,property_id){

    let transaction ; 

    try {
        transaction  = await db.sequelize.transaction();

        // find latest property id
        const propertyId = await db.PropertyModel.PropertyIdTracker.findOne({where:{id:1}});
        
        console.log(propertyId);
        const newPropertyId = propertyId.dataValues.property_id;
       
        const pendingHouse = await PendingHouse.findOne({where:{property_id:property_id},transaction})

        await House.create({...pendingHouse.get(),property_id:newPropertyId, staff_id: staff_id },{transaction});

         // Increment property_id in PropertyIdTracker
         const propertyIdTracker = await db.PropertyModel.PropertyIdTracker.findByPk(1, { transaction });
         propertyIdTracker.property_id += 1;
         await propertyIdTracker.save({ transaction });

         // delete from pending house\
         await PendingHouse.destroy({where:{property_id},transaction});

         //insert into house ads

         await HouseAds.create({property_id:newPropertyId},{transaction});

         await transaction.commit();
        
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
 }


 async function insertHouseFeedback(property_id,customer_id,feedback){
    return await HouseFeedback.create({
        property_id:property_id,
        customer_id:customer_id,
        feedback:feedback
    })
 }



 async function updateHouseAds(ads_status,property_id){
    return await HouseAds.update({ads_status:ads_status},{where:{property_id:property_id}})
}

async function insertHouseComment(property_id,staff_id,super_admin_id,comment,isPrivate){
    return await HouseComment.create({
        property_id:property_id,
        staff_id:staff_id,
        super_admin_id:super_admin_id,
        comment:comment,
        is_private:isPrivate
    })
}

async function getHouseComment(property_id,super_admin_id=null){
    return await HouseComment.findAll({
        where:{
            property_id:property_id,
            super_admin_id:super_admin_id
        }
    })
}



module.exports ={insertPendingHouse,getHouse,getHouseByID,getHouseComment,getPendingHouse,getPendingHouseByID,insertHouseFeedback,insertHouseComment,updateHouseAds,approveHouse}