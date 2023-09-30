const sequelize = require("../../../db.config");
const db = require("../../model.index");
const PropertyAdminView = db.Views.PropertyViewAdmin;
const PropertyShootSchedule = db.PropertyModel.PropertyShootSchedule;
const PropertyViewClient = db.Views.PropertyViewClient;
const PropertyIdTracker = db.PropertyModel.PropertyIdTracker;
const PropertyFieldVisitRequest = db.PropertyModel.PropertyFieldVisitRequest;
const PropertyFieldVisitComment = db.PropertyModel.PropertyFieldVisitComment;
const PropertyFieldVisitOTP = db.PropertyModel.PropertyFieldVisitOTP;
const PropertyFieldVisit = db.PropertyModel.PropertyFieldVisit;
const PropertyShootScheduleComment = db.PropertyModel.PropertyShootScheduleComment;
const RequestedPropertyView = db.Views.RequestedPropertyView
const RequestHouse = db.PropertyModel.RequestedHouse;
const RequestLand = db.PropertyModel.RequestedLand;
const RequestApartment = db.PropertyModel.RequestedApartment;
const RequestedProperty = db.PropertyModel.RequestedProperty;

// get latest property insert id
async function getPropertyId() {
  const property_id = await PropertyIdTracker.findOne({ where: { id: 1 } });
  return property_id.dataValues.property_id;
}

async function updatePropertyId(transaction) {
  try {
    const propertyIdTracker = await PropertyIdTracker.findByPk(1, {
      transaction,
    });
    //     propertyIdTracker.property_id += 1;
    //  await propertyIdTracker.save({ transaction });
    console.log("Before update Property ID")
    await propertyIdTracker.increment("property_id", { by: 1, transaction });
    console.log("propertyIdUpdate")
    return;
  } catch (error) {
    console.log("Error in update propertyId", error)
    transaction.rollback();
    throw error;
  }
}

async function getPropertyWithAds(condition, limit, offset) {
  let orderConditions = [["createdAt", "DESC"]];
  let whereConditions = {};
  let location;
  if (condition.location) {
    location = condition.location;
    whereConditions[db.Op.or] = [
      { province: { [db.Op.like]: `%${location}%` } },
      { district: { [db.Op.like]: `%${location}%` } },
      { municipality: { [db.Op.like]: `%${location}%` } },
      { area_name: { [db.Op.like]: `%${location}` } }
    ];
  }
  if (condition.property_type) {
    whereConditions.property_type = condition.property_type
  }
  if (condition.listed_for) {
    whereConditions.listed_for = condition.listed_for
  }

  return await PropertyAdminView.findAll({
    where: whereConditions,
    attributes: { exclude: ["id"] },
    order: orderConditions,
    limit: limit,
    offset: offset,
  });
}

async function insertPropertyShootSchedule(shootData) {
  return await PropertyShootSchedule.create(shootData);
}

async function getPropertyShootSchedule(condition, limit, offset) {
  return PropertyShootSchedule.findAll({
    where: condition,
    limit: limit,
    offset: offset,
  });
}

async function insertPropertyShootScheduleComment(shoot_schedule_id,admin_id,comment){
  return PropertyShootScheduleComment.create({shoot_schedule_id,admin_id,comment});
}
async function getPropertyShootScheduleComment(shoot_schedule_id,limit,offset){
  return PropertyShootScheduleComment.findAll({
    where:{shoot_schedule_id:shoot_schedule_id},
    limit:limit,
    offset:offset
  })
}

async function getProperty(condition, limit, offset) {
  return await PropertyViewClient.findAll({
    where: condition,
    attributes: { exclude: ["id"] },
    order: [["createdAt", "DESC"]],
    limit: limit,
    offset: offset,
  });
}

async function getLatestPropertyPriorityLocation(condition, limit, offset) {
  let orderConditions = [["createdAt", "DESC"]];
  let whereConditions = {};

  if (condition.district) {
    orderConditions.unshift([
      db.sequelize.literal(
        `(CASE WHEN district='${condition.district}' THEN 1 ELSE 2 END)`
      ),
      "ASC",
    ]);
    delete condition.district;
  }
  let location;
  if (condition.location) {
    location = condition.location;
    whereConditions[db.Op.or] = [
      { province: { [db.Op.like]: `%${location}%` } },
      { district: { [db.Op.like]: `%${location}%` } },
      { municipality: { [db.Op.like]: `%${location}%` } },
      { area_name: { [db.Op.like]: `%${location}` } }
    ];
  }

  // Handle price range filtering
  if (condition.priceRange) {
    if (condition.priceRange.minPrice && condition.priceRange.maxPrice) {
      whereConditions.price = {
        [db.Op.between]: [
          condition.priceRange.minPrice,
          condition.priceRange.maxPrice,
        ],
      };
    } else if (condition.priceRange.minPrice) {
      whereConditions.price = {
        [db.Op.gte]: condition.priceRange.minPrice,
      };
    } else if (condition.priceRange.maxPrice) {
      whereConditions.price = {
        [db.Op.lte]: condition.priceRange.maxPrice,
      };
    }


  }

  delete condition.location;
  delete condition.priceRange;
  console.log(condition);
  return await PropertyViewClient.findAll({
    where: whereConditions,
    // attributes: { exclude: ["id"] },
    attributes: ['property_id',
      'property_type',
      'property_name',
      'listed_for',
      'price',
      'district',
      'municipality',
      'area_name',
      //  [sequelize.fn('JSON_PARSE', sequelize.col('social_media')), 'social_media'],
      //  [sequelize.fn('JSON_PARSE', sequelize.col('property_image')), 'property_image'],
      'social_media',
      'property_image',
      'views'],
    order: orderConditions,
    // replacements: [condition.district],
    // limit: limit,
    // offset: offset,
  });
}


async function insertPropertyFieldVisitRequest(data) {
  return await PropertyFieldVisitRequest.create(data);
}

async function getPropertyFieldVisitRequest(condition,limit,offset){
  let whereConditions = {};
  if(condition){
    whereConditions[db.Op.or] = [
      {name:{[db.Op.like]:`%${condition}`}},
      {property_type:{[db.Op.like]:`%${condition}`}}
    ]
  }


  return await PropertyFieldVisitRequest.findAll({
    where:whereConditions,
    limit:limit,
    offset:offset,
    include: [{
      model:db.UserModel.User,
      required: false  // This ensures that the join is a LEFT OUTER JOIN, not an INNER JOIN
    }],
   
  })
}

async function getPropertyFieldVisitRequestByID(field_visit_id,attributes=[]){

  return await PropertyFieldVisitRequest.findOne({
    where:{field_visit_id:field_visit_id},
    include:[{
      model:db.UserModel.User,
      required:false,
    }],
    attributes:attributes
  })

}


async function updatePropertyFieldVisitRequest(updateCondition,field_visit_id){
  return await PropertyFieldVisitRequest.update(updateCondition,{
    where: {field_visit_id:field_visit_id}
  })
}


async function deletePropertyFieldVisitRequest(field_visit_id){
  return await PropertyFieldVisitRequest.destroy({
    where:{field_visit_id:field_visit_id}
  })
}

async function insertPropertyFieldVisitComment(data) {
  return await PropertyFieldVisitComment.create(data);
}

async function insertPropertyFieldVisitOTP(data){
  return await PropertyFieldVisitOTP.create(data)
}
async function getPropertyFieldVisitOTP(field_visit_id){
  return await PropertyFieldVisitOTP.findOne({where:{
    field_visit_id:field_visit_id
  }})
}

async function deletePropertyFieldVisitOTP(field_visit_id){
  return await PropertyFieldVisitOTP.destroy({where:{field_visit_id:field_visit_id}})
}

async function insertPropertyFieldVisit(data){
  return await PropertyFieldVisit.create(data);
}

async function getPropertyFieldVisit(){

}

async function countListingProperty(condition){
  return await PropertyViewClient.count({
    where:condition
  })

}

async function getRequestProperty(condition,limit,offset){
  return await RequestedProperty.findAll({
    where:condition,
    order: [['createdAt', 'DESC']],
    include:[{
      model:db.UserModel.User,
      attributes: ['name', 'email', 'phone_number']
    }],
    limit:limit,
    offset:offset
  })
 
  
    // // Fetch data for each property type
    // const requestHousePromise = RequestHouse.findAll({
    //     where: condition,
    //     include: [{
    //         model: db.UserModel.User,
    //         attributes: ['name', 'email', 'phone_number']
    //     }],
    //     order: [['createdAt', 'DESC']],
    //   //  attributes: { exclude: ['columnToExclude'] }, // Modify as necessary
    //     limit: Math.ceil(limit / 3),
    //     offset: offset
    // });

    // const requestLandPromise = RequestLand.findAll({
    //     where: condition,
    //     include: [{
    //         model: db.UserModel.User,
    //         attributes: ['name', 'email', 'phone_number']
    //     }],
    //     order: [['createdAt', 'DESC']],
    //     //attributes: { exclude: ['columnToExclude'] }, // Modify as necessary
    //     limit: Math.ceil(limit / 3),
    //     offset: offset
    // });

    // const requestApartmentPromise = RequestApartment.findAll({
    //     where: condition,
    //     include: [{
    //         model: db.UserModel.User,
    //         attributes: ['name', 'email', 'phone_number']
    //     }],
    //     order: [['createdAt', 'DESC']],
    //    // attributes: { exclude: [''] }, // Modify as necessary
    //     limit: Math.ceil(limit / 3),
    //     offset: offset
    // });

    // // Resolve all promises
    // const [requestHouses, requestLands, requestApartments] = await Promise.all([requestHousePromise, requestLandPromise, requestApartmentPromise]);

    // // Combine and sort the results
    // const combinedResults = [...requestHouses, ...requestLands, ...requestApartments];
    // combinedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // // Limit the results if combined results exceed the original limit
    // return combinedResults.slice(0, limit);
}

async function insertRequestedProperty(data){
  return await  RequestedProperty.create(data);
}

module.exports = {
  getPropertyWithAds,
  insertPropertyShootSchedule,
  getPropertyShootSchedule,
  getProperty,
  getLatestPropertyPriorityLocation,
  getPropertyId,
  updatePropertyId,
  insertPropertyFieldVisitRequest,
  updatePropertyFieldVisitRequest,
  deletePropertyFieldVisitRequest,
  insertPropertyFieldVisitComment,
  insertPropertyFieldVisitOTP,
  getPropertyFieldVisitOTP,
  deletePropertyFieldVisitOTP,
  insertPropertyFieldVisit,
  getPropertyFieldVisitRequest,
  getPropertyFieldVisitRequestByID,
  insertPropertyShootScheduleComment,
  getPropertyShootScheduleComment,
  countListingProperty,
  getRequestProperty,
  insertRequestedProperty
};
