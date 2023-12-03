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
    // Add the 'status' field to the condition with the value 'pending'
    const updatedCondition = {
        status: 'pending',
        ...condition,    
    };
    const [pendingLand,totalCount] = await Promise.all([Land.findAll({
        where : updatedCondition,
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
    }),Land.count({where:updatedCondition})])

    return {pendingLand,totalCount};
 }


 async function getPendingLandByID(property_id){
    return await Land.findOne({
        where:{property_id:property_id,status:'pending'},
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
    return await Land.destroy({
        where:{property_id:property_id,status:'pending'}
    })
 }


 async function approveLand(staff_id,property_id){

    return await House.update({status:'approved',approved_by:staff_id},{where:{property_id:property_id}});
    
 }

 async function updateLandListingType(property_id,listing_type){
    return await Land.update({listed_for:listing_type},{where:{property_id:property_id}})
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
    return await Land.update({status:'sold'},{where:{property_id:property_id}});
}

async function getSoldLandByID(property_id){
    return await Land.findOne({
        where:{property_id:property_id,status:'sold'}
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
    deletePendingLand,
    updateLandListingType
    
}