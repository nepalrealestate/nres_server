const sequelize = require("../../../db.config");
const db = require("../../model.index");
const PropertyAdminView = db.Views.PropertyViewAdmin;
const PropertyShootSchedule = db.PropertyModel.PropertyShootSchedule;
const PropertyViewClient = db.Views.PropertyViewClient;
const PropertyIdTracker = db.PropertyModel.PropertyIdTracker;
const PropertyFieldVisit = db.PropertyModel.PropertyFieldVisit;
const PropertyFieldVisitComment = db.PropertyModel.PropertyFieldVisitComment;

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
    console.log("Error in update propertyId",error)
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
      {area_name : {[db.Op.like] : `%${location}`}}
    ];
  }
  if(condition.property_type){
    whereConditions.property_type = condition.property_type
  }
  if(condition.listed_for){
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

async function insertPropertyShootSchedule(
  property_id,
  property_type,
  shoot_status,
  shoot_date
) {
  return await PropertyShootSchedule.create({
    property_id: property_id,
    property_type: property_type,
    shoot_status: shoot_status,
    date: shoot_date,
  });
}

async function getPropertyShootSchedule(condition, limit, offset) {
  return PropertyShootSchedule.findAll({
    where: condition,
    limit: limit,
    offset: offset,
  });
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
      {area_name : {[db.Op.like] : `%${location}`}}
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
   attributes:['property_id',
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


async function insertPropertyFieldVisit(data){
  return await PropertyFieldVisit.create(data);
}

async function insertPropertyFieldVisitComment(data){
  return await PropertyIdTracker.create(data);
}

module.exports = {
  getPropertyWithAds,
  insertPropertyShootSchedule,
  getPropertyShootSchedule,
  getProperty,
  getLatestPropertyPriorityLocation,
  getPropertyId,
  updatePropertyId,
  insertPropertyFieldVisit,
  insertPropertyFieldVisitComment
};
