
const db = require("../../model.index");
const { propertyServiceUtility } = require("../service.utils");
const { updatePropertyId, getPropertyId, getLatestPropertyPriorityLocation } = require("./service.property");
const House = db.PropertyModel.House
const PendingHouse = db.PropertyModel.PendingHouse
const HouseAds = db.PropertyModel.HouseAds
const HouseFeedback = db.PropertyModel.HouseFeedback
const HouseComment = db.PropertyModel.HouseComment
const HouseViews = db.PropertyModel.HouseViews
const HouseViewsCount = db.PropertyModel.HouseViewsCount
const RequestedHouse = db.PropertyModel.RequestedHouse

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

 
 async function getHouseByID(property_id,requiredAttributes=[]){
    // return await House.findByPk(property_id)
    return await House.findOne({
        where:{property_id:property_id},
        include:[HouseViewsCount],
        attributes :  requiredAttributes
    })
 }

 async function getPendingHouse(condition,limit,offset){
    return await PendingHouse.findAll({
        where : condition,
        attributes:[ 'property_id','property_name','listed_for','price','views'],
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
    //update views in House table and HouseViewsCount Table
    // let transaction ;

    // try {
    //     transaction = await db.sequelize.transaction();
    //     // create new views 
    //     await HouseViews.create({property_id,latitude,longitude},{transaction});

    //     // update House views
    //     await House.increment('views',{by:1,where:{property_id:property_id},transaction});

    //     await transaction.commit();
    //     return;
    // } catch (error) {
    //     console.log(error)
    //     await transaction.rollback();
    //     throw error;
    // }

    HouseViews.create({property_id,latitude,longitude}).catch((error)=>{
        logger.error(`Error while insert House View Location - ${error}`)
    });
}



async function insertRequestedHouse (data){
    return await RequestedHouse.create(data);
}

async function getRequestedHouse(condition){
    propertyService.getProperty(condition,RequestedHouse);
}



module.exports ={insertHouse,
    insertPendingHouse,
    updateHouse,
    deleteHouse,
    getHouse,
    getHouseByID,
    getHouseComment,
    getPendingHouse,
    getPendingHouseByID,
    insertHouseFeedback,
    insertHouseComment,
    updateHouseAds,
    approveHouse,
    updateHouseViews,
    insertRequestedHouse,
    getRequestedHouse}