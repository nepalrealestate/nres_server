const logger = require("../../../utils/errorLogging/logger");
const db = require("../../model.index");
const { getPropertyId, updatePropertyId } = require("./service.property");

const propertyService = require("../service.utils").propertyServiceUtility();

const Land = db.PropertyModel.Land;
const PendingLand = db.PropertyModel.PendingLand
const LandAds = db.PropertyModel.LandAds
const LandComment = db.PropertyModel.LandComment
const LandFeedback = db.PropertyModel.LandFeedback
const LandViews = db.PropertyModel.LandViews
const RequestedLand = db.PropertyModel.RequestedLand
const LandSold = db.PropertyModel.LandSold;


async function insertPendingLand(land){
    return await PendingLand.create(land)
}

async function insertLand(land){
    let transaction ; 

    try {
        transaction  = await db.sequelize.transaction();

        const property_id = await getPropertyId();
        

       const createdLand=  await Land.create({
            property_id:property_id,
            ...land
        });
        await LandAds.create({property_id:property_id},{transaction});
        
        await updatePropertyId(transaction);
        transaction.commit();
        return createdLand;

    //return await  Apartment.create(apartment);
}catch(error){
    transaction.rollback();
    throw error;
    
}
}

async function updateLand(property_id,updateData){
    return await Land.update(updateData,{
        where:{property_id:property_id}
    })
}

async function getLand(condition){

    return await propertyService.getProperty(condition,Land)
    // return await Land.findAll({
    //     where:condition,
    //     attributes:[ 'property_id','property_name','listed_for','price','views'],
    //     limit:limit,
    //     offset:offset
    // })
}

async function getLandByID(property_id,requiredAttributes=null){
    return await Land.findOne({
        where:{property_id:property_id},
        
        attributes: requiredAttributes
    });
}

async function getLandWithOwnerByID(property_id){
    return await Land.findOne({
        where:{property_id:property_id},
        include:[{
            model:db.UserModel.User,
            as:'owner',
            attributes:['name','email','phone_number']
        }],
        attributes:['property_id','property_type','province','district','municipality','area_name','ward']
    })
}

async function getPendingLand(condition,limit,offset){
    const [pendingLand,totalCount] = await Promise.all([PendingLand.findAll({
        where : condition,
        attributes:[ 'property_id','property_type','property_name','listed_for','province','district','municipality','ward','area_name','createdAt'],
        include:[
            {
                model:db.UserModel.User,
                as:'owner',
                attributes:['name','email','phone_number']
            }
        ],
        order:[['createdAt','DESC']],
        limit:limit,
        offset:offset
    }),PendingLand.count({where:condition})])

    return {pendingLand,totalCount};
 }


 async function getPendingLandByID(property_id){
    return await PendingLand.findOne({
        where:{property_id:property_id},
        include:[
            {
                model:db.UserModel.User,
                as:'owner',
                attributes:['name','email','phone_number']
            }
        ],

    })
 }

 async function deletePendingLand(property_id){
    return await PendingLand.destroy({
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

        await Land.create({...pendingLand.get(),property_id:newPropertyId, approved_by: staff_id },{transaction});

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



 async function updateLandAds(platform,ads_status,property_id){
    return await LandAds.update({[platform]:ads_status},{where:{property_id:property_id}})
}

async function deleteLand(property_id){
    return await Land.destroy({
        where:{property_id:property_id}
    })
}

async function insertLandComment(property_id,admin_id,comment,isPrivate){
    return await LandComment.create({
        property_id:property_id,
        admin_id:admin_id,
        comment:comment,
        is_private:isPrivate
    })
}

async function getLandComment(property_id){
    return await  LandComment.findAll({
        where:{
            property_id:property_id,
            
        },
        attributes:{exclude:['is_private','updatedAt',
        'property_id']},
        include:[{
            model:db.UserModel.Admin,
            attributes:['name']
        }]
    })
}


async function updateLandViews(property_id,latitude,longitude){
    //update views in Apartment table and Land views  Table
    // let transaction ;


    // try {
    //     transaction = await db.sequelize.transaction();
    //     // create new views 
    //     await LandViews.create({property_id,latitude,longitude},{transaction});

    //     // update Apartment views
    //     await Land.increment('views', { by: 1, where: { property_id: property_id }, transaction });

    //     await transaction.commit();
    //     return;

    // } catch (error) {

    //     await transaction.rollback();
    //     throw error;
    // }

    LandViews.create({property_id,latitude,longitude}).catch((error)=>{
        logger.error(`Error while insert Land View Location - ${error}`)
    });

}

async function soldLand(property_id){
    let transaction;
    try {
        
        transaction = await db.sequelize.transaction();
        const land = await Land.findOne({where:{property_id:property_id},transaction});
        await LandSold.create({...land.get()},{transaction});
        await Land.destroy({where:{property_id:property_id},transaction});
        return await transaction.commit();
    } catch (error) {
        if(transaction) await transaction.rollback();
        throw error;
    }
}

async function getSoldLandByID(property_id){
    return await LandSold.findOne({
        where:{property_id:property_id}
    })
}

module.exports = {
    insertLand,
    updateLand,
    deleteLand,
    insertPendingLand,
    getLand,
    getLandByID,
    getLandWithOwnerByID,
    getLandComment,
    getPendingLand,
    getPendingLandByID,
    insertLandFeedback,
    insertLandComment,
    updateLandAds,
    approveLand,
    updateLandViews,
    soldLand,
    getSoldLandByID,
    deletePendingLand
    
}