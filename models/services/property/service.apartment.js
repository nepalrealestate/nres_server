
const logger = require("../../../utils/errorLogging/logger");
const { areKeysNumeric } = require("../../../utils/helperFunction/helper");
const db = require("../../model.index");
const { getPropertyId, updatePropertyId } = require("./service.property");

const propertyService = require("../service.utils").propertyServiceUtility();

const Apartment = db.PropertyModel.Apartment;
const PendingApartment = db.PropertyModel.PendingApartment;
const ApartmentAds = db.PropertyModel.ApartmentAds;
const ApartmentFeedback = db.PropertyModel.ApartmentFeedback;
const ApartmentComment = db.PropertyModel.ApartmentComment
const ApartmentViews = db.PropertyModel.ApartmentViews
const ApartmentViewsCount = db.PropertyModel.ApartmentViewsCount;
const ApartmentShootSchedule = db.PropertyModel.ApartmentShootSchedule;
const RequestedApartment = db.PropertyModel.RequestedApartment;
const ApartmentSold = db.PropertyModel.ApartmentSold;
const ApartmentFavourite = db.PropertyModel.ApartmentFavourite;


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
        await ApartmentAds.create({property_id:property_id},{transaction})
        await updatePropertyId(transaction);
        transaction.commit();
        console.log("Commit succesfull");
        return createdApartment;

    //return await  Apartment.create(apartment);
}catch(error){
    console.log(error)
    transaction.rollback();
    throw error;
    
}
}

async function updateApartment(property_id,updateData){

    if(updateData.property_image){
        let existingPropertyImage = {};
        // Fetch the existing property_image from the database
     const existingApartment = await Apartment.findOne({
        where: { property_id: property_id },
        attributes: ['property_image']
    });
    if(existingApartment && !existingApartment.dataValues.property_image && areKeysNumeric(updateData.property_image)){
        //image is not present then if image have already key value then update direclty
        console.log("This is update image after insert",updateData.property_image)
            return await Apartment.update(updateData, {
                where: { property_id: property_id }
            });
        
    }
    if (existingApartment && existingApartment.dataValues.property_image) {
        try {
            existingPropertyImage = (existingApartment.dataValues.property_image);
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

   return await Apartment.update(updateData,
        {
            where:{property_id:property_id}
        })

}

async function deleteApartment(property_id){
    return await Apartment.destroy({
        where:{property_id:property_id}
    })
}

async function deleteApartmentImage(property_id,imageLink){
    // Fetch the existing property_image from the database
    const existingProperty = await Apartment.findOne({
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
   return await Apartment.update({ property_image: reindexedPropertyImage }, {
        where: { property_id: property_id }
    });
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

async function getApartmentByID(property_id,requiredAttributes=null){

    const data  = await Apartment.findOne({
        where:{property_id:property_id},
        include:[{
            model:db.PropertyModel.ApartmentViewsCount,
            attributes: [ 'views'], // Use COALESCE to return 0 if there are no views
            as: 'apartmentViews',
            required: false, // Perform a LEFT JOIN
        
        }],
        attributes:requiredAttributes
    })
    console.log("Data WIth Views",data)
    if(data && data.apartmentViews && data.apartmentViews.dataValues && data.apartmentViews.dataValues.views!==null){
        data.dataValues.views = data.apartmentViews.dataValues.views;
    }else{
        data.dataValues.views = 0;
    }
    delete data.dataValues.apartmentViews;
    return data;
    
}

async function getApartmentWithOwnerByID(property_id){
    return await Apartment.findOne({
        where:{property_id:property_id},
        include:[{
            model:db.UserModel.User,
            as:'owner',
            attributes:['name','email','phone_number']
        }],
        attributes:['property_id','property_type','province','district','municipality','area_name','ward']
    })
}

async function getPendingApartment(condition,limit,offset){
    // Add the 'status' field to the condition with the value 'pending'
    const updatedCondition = {
        status: 'pending',
        ...condition,    
    };
    
    const [pendingApartment,totalCount]  = await Promise.all([Apartment.findAll({
        where : updatedCondition,
        attributes:[ 'property_id','property_type','property_name','listed_for','province','district','municipality','ward','area_name'],
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
    }),Apartment.count({where:updatedCondition})]);


    return {pendingApartment,totalCount};


}


async function getPendingApartmentByID(property_id){
    return await Apartment.findOne({
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

async function deletePendingApartment(property_id){
    return await Apartment.destroy({
        where:{property_id:property_id,status:'pending'}
    })
}

async function approveApartment(staff_id,property_id){
        return await Apartment.update({status:'approved',approved_by:staff_id},{where:{property_id:property_id}});  
}

async function updateApartmentListingType(property_id,listing_type){
    return await Apartment.update({listing_type:listing_type},{where:{property_id:property_id}})
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

async function insertApartmentComment(property_id,admin_id,comment,isPrivate){
    return await ApartmentComment.create({
        property_id:property_id,
        admin_id:admin_id,
        comment:comment,
        is_private:isPrivate
    })
}

async function getApartmentComment(property_id){
    return await ApartmentComment.findAll({
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


async function updateApartmentViews(property_id,latitude,longitude){

    ApartmentViews.create({property_id,latitude,longitude}).catch((error)=>{
        logger.error(`Error while insert Apartment View Location - ${error}`)
    });

}


async function soldApartment(property_id){

    return await Apartment.update({status:'sold'},{where:{property_id:property_id}});
}


async function getSoldApartmentByID(property_id){
    return await Apartment.findOne({
        where:{property_id:property_id,status:'sold'}
    })
}

async function insertApartmentFavourite(property_id,user_id){
    return await ApartmentFavourite.create({
        property_id:property_id,
        user_id:user_id
    })
}

async function deleteApartmentFavourite(property_id,user_id){
    return await ApartmentFavourite.destroy({
        where:{
            property_id:property_id,
            user_id:user_id
        }
    })
}

async function getApartmentFavourite(user_id,limit,offset){

    return await ApartmentFavourite.findAll({
        where:{
            user_id:user_id
        },
        include:[{
            model:Apartment,
            as:'favourite'
        }],
        limit:limit,
        offset:offset
    })
}





module.exports = {insertApartment,
    insertPendingApartment,
    updateApartment,
    deleteApartment,
    deleteApartmentImage,
    getApartment,
    getApartmentByID,
    getApartmentWithOwnerByID,
    getPendingApartment,
    approveApartment,
    getPendingApartmentByID,
    insertApartmentFeedback,
    updateApartmentAds,
    insertApartmentComment,
    getApartmentComment,
    updateApartmentViews,
    soldApartment,
    getSoldApartmentByID,
    deletePendingApartment,
    updateApartmentListingType,
    insertApartmentFavourite,
    deleteApartmentFavourite,
    getApartmentFavourite
    };