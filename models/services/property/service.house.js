
const db = require("../../model.index");
const { propertyServiceUtility } = require("../service.utils");
const { updatePropertyId, getPropertyId, getLatestPropertyPriorityLocation } = require("./service.property");
const House = db.PropertyModel.House
const PendingHouse = db.PropertyModel.PendingHouse
const HouseAds = db.PropertyModel.HouseAds
const HouseFeedback = db.PropertyModel.HouseFeedback
const HouseComment = db.PropertyModel.HouseComment
const HouseViews = db.PropertyModel.HouseViews
const HomeLoan = db.PropertyModel.HomeLoan;


const propertyService = propertyServiceUtility();

 async function insertPendingHouse(house){
    return await PendingHouse.create(house);
 }

 async function insertHouse(house){
    
    console.log("Insert model House ",house)
    let transaction ; 

    try {
        transaction  = await db.sequelize.transaction();

        const property_id = await getPropertyId();
        

       const createdHouse =  await House.create({
            property_id:property_id,
            ...house
        });
        await HouseAds.create({property_id:property_id},{transaction});
        await updatePropertyId(transaction);
        transaction.commit();
        return createdHouse;

    //return await  Apartment.create(apartment);
}catch(error){
    transaction.rollback();
    throw error;
    
}
 }

 async function updateHouse(property_id,updateData){
    return await House.update(updateData,{
        where:{property_id:property_id}
    })
 }


async function deleteHouse(property_id){
    return await House.destroy({
        where:{property_id:property_id}
    })
}


 async function getHouse(condition){

    return await propertyService.getProperty(condition,House);



    // return await House.findAll({
    //     where:condition,
    //     attributes:[ 'property_id','property_name','listed_for','price','views'],
    //     limit:limit,
    //     offset:offset
    // })
 }

 
 async function getHouseByID(property_id,requiredAttributes=null){
    // return await House.findByPk(property_id)
    const data = await House.findOne({
        where:{property_id:property_id},
        include:[{
            model:db.PropertyModel.HouseViewsCount,
            attributes: [ 'views'], // Use COALESCE to return 0 if there are no views
            as: 'houseViews',
            required: false, // Perform a LEFT JOIN
        }],
        attributes :  requiredAttributes
    })
    if(data && data.houseViews && data.houseViews.dataValues && data.houseViews.dataValues.views !== null){
        data.dataValues.views = data.houseViews.dataValues.views;
        
    }else{
        data.dataValues.views = 0;
    }
    delete data.dataValues.houseViews;
    return data;
 }

 async function getHouseWithOwnerByID(property_id){
    return await House.findOne({
        where:{property_id:property_id},
        include:[{
            model:db.UserModel.User,
            as:'owner',
            attributes:['name','email','phone_number']
        }],
        attributes:['property_id','property_type','province','district','municipality','area_name','ward']

    })
 }

 async function getPendingHouse(condition,limit,offset){

    // Add the 'status' field to the condition with the value 'pending'
    const updatedCondition = {
        status: 'pending',
        ...condition,    
    };

    const [pendingHouse,totalCount] = await Promise.all([House.findAll({
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
    }),House.count({where:updatedCondition})])
    return {pendingHouse,totalCount};
 }


 async function getPendingHouseByID(property_id){
    return await House.findOne({
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

 async function deletePendingHouse(property_id){
    return await House.destroy({
        where:{property_id:property_id,status:'pending'}
    })
 }



 async function approveHouse(staff_id,property_id){

    return await House.update({status:'approved',approved_by:staff_id},{where:{property_id:property_id}});
   
 }

 async function updateHouseListingType(property_id,listing_type){
    return await House.update({listing_type:listing_type},{where:{property_id:property_id}})
}




 async function insertHouseFeedback(property_id,customer_id,feedback){
    return await HouseFeedback.create({
        property_id:property_id,
        customer_id:customer_id,
        feedback:feedback
    })
 }



 async function updateHouseAds(platform,ads_status,property_id){
    return await HouseAds.update({[platform]:ads_status},{where:{property_id:property_id}})
}

async function insertHouseComment(property_id,admin_id,comment,isPrivate){
    return await HouseComment.create({
        property_id:property_id,
        admin_id:admin_id,
        comment:comment,
        is_private:isPrivate
    })
}

async function getHouseComment(property_id){
    return await HouseComment.findAll({
        where:{
            property_id:property_id    
        },
        attributes:{exclude:['is_private','updatedAt',
        'property_id']},
        include:[{
            model:db.UserModel.Admin,
            attributes:['name']
        }]
    })
}


async  function updateHouseViews(property_id,latitude,longitude){
    
    HouseViews.create({property_id,latitude,longitude}).catch((error)=>{
        logger.error(`Error while insert House View Location - ${error}`)
    });
}


async function soldHouse(property_id){
    return await House.update({status:'sold'},{where:{property_id:property_id}});
}


async function getSoldHouseByID(property_id){
    return await House.findOne({
        where:{property_id:property_id,status:'sold'}
    })
}


module.exports ={insertHouse,
    insertPendingHouse,
    updateHouse,
    deleteHouse,
    getHouse,
    getHouseByID,
    getHouseWithOwnerByID,
    getHouseComment,
    getPendingHouse,
    getPendingHouseByID,
    insertHouseFeedback,
    insertHouseComment,
    updateHouseAds,
    approveHouse,
    deletePendingHouse,
    updateHouseViews,
    soldHouse,
    getSoldHouseByID,
    updateHouseListingType,

}
