
const logger = require("../../../utils/errorLogging/logger");
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

    //  const data = await Apartment.findByPk(property_id);
    //  return data!==null?data.get():null;
    const data  = await Apartment.findOne({
        where:{property_id:property_id},
        include:[ApartmentViewsCount],
        attributes:requiredAttributes
    })
    return data;
    // console.log(property_id)
    // const apartment = await Apartment.findOne({where:{property_id}});
    // console.log(apartment)
    // return apartment;
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
        return await House.update({status:'approved',approved_by:staff_id},{where:{property_id:property_id}});  
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
    //update views in Apartment table and ApartmentViewsCount Table
    // let transaction ;


    // try {
    //     transaction = await db.sequelize.transaction();
    //     // create new views 
    //     await ApartmentViews.create({property_id,latitude,longitude},{transaction});

    //     // update Apartment views
    //     await Apartment.increment('views', { by: 1, where: { property_id: property_id }, transaction });

    //     await transaction.commit();
    //     return;

    // } catch (error) {

    //     await transaction.rollback();
    //     throw error;
    // }
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



module.exports = {insertApartment,
    insertPendingApartment,
    updateApartment,
    deleteApartment,
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
    updateApartmentListingType
    };