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
const LandFavourite = db.PropertyModel.LandFavourite;


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
    
    if(updateData.property_image){
        let existingPropertyImage = {};
        // Fetch the existing property_image from the database
     const existingLand = await Land.findOne({
        where: { property_id: property_id },
        attributes: ['property_image']
    });

    // Parse the existing property_image JSON object or initialize an empty object
    console.log("This is existing land",existingLand)
    if (existingLand && existingLand.dataValues.property_image) {
        try {
            existingPropertyImage = (existingLand.dataValues.property_image);
        } catch (error) {
            console.error('Error parsing existing property_image JSON:', error);
            return null;
        }
    }
    // Find the next available index
    const nextIndex = Object.keys(existingPropertyImage).length;
    // Add the new image link to the property_image JSON object
    const newImageLink = updateData.property_image; // Use the provided image link
    existingPropertyImage[nextIndex] = newImageLink;
    updateData.property_image = null;
    updateData.property_image = existingPropertyImage;
    }
    
    return await Land.update(updateData, {
        where: { property_id: property_id }
    });
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

async function getLandByID(property_id, requiredAttributes = null) {
    const result = await Land.findOne({
      where: { property_id: property_id },
      include: [
        {
          model: db.PropertyModel.LandViewsCount,
          attributes: ['views'],
          as: 'landViews',
          required: false,
        },
      ],
      attributes: requiredAttributes,
    });
  
    if (result && result.landViews && result.landViews.dataValues && result.landViews.dataValues.views !== null) {
      result.dataValues.views = result.landViews.dataValues.views;
      
    } else {
      result.dataValues.views = 0;
    }
    delete result.dataValues.landViews;
  
    return result;
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

    return await Land.update({status:'approved',approved_by:staff_id},{where:{property_id:property_id}});
    
 }

 async function updateLandListingType(property_id,listing_type){
    return await Land.update({listing_type:listing_type},{where:{property_id:property_id}})
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

async function deleteLandImage(property_id,imageLink){
        // Fetch the existing property_image from the database
        const existingProperty = await Land.findOne({
            where: { property_id: property_id },
            attributes: ['property_image'],
        });
        if (!existingProperty || !existingProperty.dataValues.property_image) {
            // Handle the case where property_image is not found or is empty
            console.error('Property not found or property_image is empty.');
            throw new Error('Property Not Found')
        }
        let existingPropertyImage = existingProperty.dataValues.property_image
         // Find the index of the specified image link
         const indexToRemove = Object.keys(existingPropertyImage).find(
            key => existingPropertyImage[key] === imageLink
        );
    
        if (!indexToRemove) {
            // Handle the case where the specified image link is not found
            console.error('Image link not found in property_image.');
            throw new Error("Image Link Not Found")
        }
    
        // Remove the specified image link from the property_image object
        delete existingPropertyImage[indexToRemove];
        console.log("This is deleted existing property image",existingPropertyImage)
    
        // Reindex the keys in the updated object
        const reindexedPropertyImage = {};
        let newIndex = 0;
        for (const key in existingPropertyImage) {
            reindexedPropertyImage[newIndex] = existingPropertyImage[key];
            newIndex++;
        }
        console.log("This is reindexed property image",reindexedPropertyImage)
    
        // Update the property_image field in the database
       return await Land.update({ property_image: reindexedPropertyImage }, {
            where: { property_id: property_id }
        });
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

async function insertLandFavourite(property_id,user_id){
    return await LandFavourite.create({
        property_id:property_id,
        user_id:user_id
    })
}

async function deleteLandFavourite(property_id,user_id){
    return await LandFavourite.destroy({
        where:{
            property_id:property_id,
            user_id:user_id
        }
    })
}

async function getLandFavourite(user_id,limit,offset){
    return await LandFavourite.findAndCountAll({
        where:{user_id:user_id},
        include:[{
            model:Land,
            as:'favourite',
        }],
        limit:limit,
        offset:offset
    
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
    updateLandListingType,
    deleteLandImage,
    insertLandFavourite,
    deleteLandFavourite,
    getLandFavourite
    
}