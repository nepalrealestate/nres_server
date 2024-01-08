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
const RequestedProperty = db.PropertyModel.RequestedProperty;
const SoldPropertyView = db.Views.SoldPropertyView;
const HomeLoan = db.PropertyModel.HomeLoan;
const FavouriteProperty  = db.PropertyModel.FavouriteProperty

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
  let orderConditions = ["createdAt", "DESC"];
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
  if(condition.status){
    whereConditions.status = condition.status
  }

  return await PropertyAdminView.findAndCountAll({
    where: whereConditions,
    attributes: { exclude: ["id"] },
    order: [orderConditions],
    limit: limit,
    offset: offset,
    raw: true,
  });
}

async function insertPropertyShootSchedule(shootData) {
  return await PropertyShootSchedule.create(shootData);
}

async function getPropertyShootSchedule(condition, limit, offset) {
  if(condition?.search){
    console.log(condition.search)
    condition[db.Op.or] = [
      { location: { [db.Op.like]: `%${condition.search}%` } },
      { property_type: { [db.Op.like]: `%${condition.search}%` } }
    ]
    delete condition.search;
  }
  console.log(condition)
  return PropertyShootSchedule.findAll({
    where: condition,
    limit: limit,
    offset: offset,
  });
}

async function updatePropertyShootSchedule(updateCondition, shoot_schedule_id) {
  return PropertyShootSchedule.update(updateCondition, {
    where: { id: shoot_schedule_id },
  });
}

async function deletePropertyShootSchedule(shoot_schedule_id) {
  return PropertyShootSchedule.destroy({
    where: {id: shoot_schedule_id },
  });
}

async function insertPropertyShootScheduleComment(shoot_schedule_id,admin_id,comment){
  return PropertyShootScheduleComment.create({shoot_schedule_id,admin_id,comment});
}
async function getPropertyShootScheduleComment(shoot_schedule_id,limit,offset){
  return PropertyShootScheduleComment.findAll({
    where:{shoot_schedule_id:shoot_schedule_id},
    include:[{
      model:db.UserModel.Admin,
      as:'admin',
      attributes: ['name']
  
    }],
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

async function getPropertyWithOwner(condition,limit,offset){

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
  if(condition.status){
    whereConditions.status = condition.status
  }

  return await PropertyViewClient.findAndCountAll({
    where:whereConditions,
    attributes:{exclude:['id']},
    order:[['createdAt','DESC']],
    limit:limit,
    offset:offset,
    include:[{
      model:db.UserModel.User,
      as:'owner',
      attributes:['name','email','phone_number'],
      //raw:true
    }],
    //raw:true
  })
}

async function getPropertyList(condition,limit, offset) {
  return await PropertyViewClient.findAll({
    where: condition,
    attributes: ['property_id','property_name','property_type','listed_for'],
    order: [["createdAt", "DESC"]],
    limit: limit,
    offset: offset,
  });
}

async function countListingProperty(condition){
  return await PropertyViewClient.count({
    where:condition
  })

}

async function getLatestPropertyPriorityLocation(condition, limit, offset) {
  let orderConditions = [];
  let whereConditions = {};
  // sorting 
  if(condition.sort){
    let order = condition.order?condition.order : "DESC";
    console.log("THis is order sort sort sort",condition.sort)
    orderConditions.push([condition.sort, order]);
  }else{
    orderConditions.push(["createdAt", "DESC"])
  }

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
  delete condition.district;
  delete condition.sort;
  delete condition.order;
  console.log("THis is condition ,",condition)
  console.log("This is order order order",orderConditions)
  

  whereConditions = {...condition,...whereConditions}
  console.log(whereConditions)
  const [properties, totalCount] = await Promise.all([
    PropertyViewClient.findAll({
        where: whereConditions,
        attributes: [
            'property_id', 'property_type', 'property_for', 'property_name',
            'listed_for', 'price', 'district', 'municipality', 'area_name',
            'latitude', 'longitude', 'social_media', 'property_image', 'views','listing_type'
        ],
        order: orderConditions,
        limit: limit,
        offset: offset,
    }),
    PropertyViewClient.count({ where: whereConditions })
]);
return {properties,totalCount};
}


async function insertPropertyFieldVisitRequest(data) {
  return await PropertyFieldVisitRequest.create(data);
}

async function getPropertyFieldVisitRequest(condition,limit,offset){
  let whereConditions = {};
  if(condition?.search){
    whereConditions[db.Op.or] = [
      {name:{[db.Op.like]:`%${condition.search}%`}},
      {property_type:{[db.Op.like]:`%${condition.search}%`}}
    ]
  }
  whereConditions = {...condition,...whereConditions}
  return await PropertyFieldVisitRequest.findAll({
    where:whereConditions,
    limit:limit,
    offset:offset,
    include: [{
      model:db.UserModel.User,
      as:'user',
      attributes:['name','email','phone_number'],
      required: false  // This ensures that the join is a LEFT OUTER JOIN, not an INNER JOIN
    }],
   
  })
}

async function getUserFieldVisitRequest(condition,limit,offset){
  return await PropertyFieldVisitRequest.findAll({
    where:condition,
    limit:limit,
    offset:offset,   
  })
}

async function getPropertyFieldVisitRequestByID(field_visit_id,attributes=null){

  return await PropertyFieldVisitRequest.findOne({
    where:{field_visit_id:field_visit_id},
    include:[{
      model:db.UserModel.User,
      as:'user',
      attributes:['name','email','phone_number'],
    },
  {
    model:db.PropertyModel.PropertyFieldVisitOTP,
    attributes:['otp']
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



async function insertRequestedProperty(data){
  return await  RequestedProperty.create(data);
}

async function getRequestProperty(condition, limit, offset) {
  const whereConditions = {};

  if (condition?.search) {
      whereConditions[db.Op.or] = [
          { province: { [db.Op.like]: `%${condition.search}%` } },
          { district: { [db.Op.like]: `%${condition.search}%` } },
          { municipality: { [db.Op.like]: `%${condition.search}%` } },
          { area_name: { [db.Op.like]: `%${condition.search}%` } },
          { property_type: { [db.Op.like]: `%${condition.search}%` } },
          //{ '$User.name$': { [db.Op.like]: `%${condition.search}%` } } // Note this line
      ];

      delete condition.search;
  }
  console.log(whereConditions);

  return await RequestedProperty.findAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
  });
}

async function getRequestPropertyByID(request_id){
  return await RequestedProperty.findOne({
    where:{id:request_id},
    include:[{
      model:db.UserModel.User,
      as:'request_by',
      attributes:['user_id','name','email','phone_number']
    }]
  })
}

async function deleteRequestedProperty(request_id){
  return await RequestedProperty.destroy({where:{id:request_id}})
}

async function getSoldProperty(condition,limit,offset){
  if(condition?.search){
    console.log(condition.search)
    condition[db.Op.or] = [
      { province: { [db.Op.like]: `%${condition.search}%` } },
      { district: { [db.Op.like]: `%${condition.search}%` } },
      { municipality: { [db.Op.like]: `%${condition.search}%` } },
      { area_name: { [db.Op.like]: `%${condition.search}%` } },
    ]
    delete condition.search;
  }
  const [properties,totalCount] = await Promise.all([PropertyViewClient.findAll({
    where:condition,
    order:[['updatedAt','DESC']],
    limit:limit,
    offset:offset
  }),SoldPropertyView.count({where:condition})]);

  return {properties,totalCount};

}

async function getEveryMonthSoldProperty(){
  return await SoldPropertyView.findAll({
    attributes: [
      'property_type',
      [db.sequelize.Sequelize.fn('YEAR', db.sequelize.Sequelize.col('createdAt')), 'year'],
      [db.sequelize.Sequelize.fn('MONTH', db.sequelize.Sequelize.col('createdAt')), 'month'],
      
      [db.sequelize.Sequelize.fn('COUNT', db.sequelize.Sequelize.col('property_id')), 'count']
    ],
    group: [
      [db.sequelize.Sequelize.fn('YEAR', db.sequelize.Sequelize.col('createdAt'))],
      [db.sequelize.Sequelize.fn('MONTH', db.sequelize.Sequelize.col('createdAt'))],
      'property_type',
     
    ],
    order: [
      [db.sequelize.Sequelize.fn('YEAR', db.sequelize.Sequelize.col('createdAt')), 'DESC'],
      [db.sequelize.Sequelize.fn('MONTH', db.sequelize.Sequelize.col('createdAt')), 'DESC'],
      'property_type'
    ]
  })
}


async function getPropertyByPropertyTypeCount(){
  return await PropertyAdminView.findAll({
    attributes:[
      'property_type',
      [db.sequelize.Sequelize.fn('COUNT', db.sequelize.Sequelize.col('property_id')), 'count']
    ],
    group:[
      'property_type'
    ]
  })

  }

async function getPropertyByListedForCount(){
  return await PropertyAdminView.findAll({
    attributes:[
      'listed_for',
      [db.sequelize.Sequelize.fn('COUNT', db.sequelize.Sequelize.col('property_id')), 'count']
    ],
    group:[
      'listed_for'
    ]
  })

}

//home loan
async function insertHomeLoan(homeLoan){
  return await HomeLoan.create(homeLoan);
}

async function getHomeLoan(condition,limit,offset){
  return await HomeLoan.findAll({
      where:condition,
      limit:limit,
      offset:offset
  })
}

async function deleteHomeLoan(id){
  return await HomeLoan.destroy({
      where:{id:id}
  })
}


//favourite Property
// async function getFavouriteProperty(condition,limit,offset){
//   return await db.sequelize.literal(
    
//   )
// }
async function insertFavouriteProperty(data){
  return await FavouriteProperty.create(data)
}

async function getFavouriteProperty(condition,limit,offset){
  return await FavouriteProperty.findAndCountAll({
    where:condition,
    limit:limit,
    offset:offset,
    raw:true
  })

}



module.exports = {
  getPropertyWithAds,
  insertPropertyShootSchedule,
  getPropertyShootSchedule,
  getProperty,
  getPropertyWithOwner,
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
  deletePropertyShootSchedule,
  countListingProperty,
  getRequestProperty,
  getRequestPropertyByID,
  insertRequestedProperty,
  deleteRequestedProperty,
  getSoldProperty,
  getEveryMonthSoldProperty,
  getPropertyByPropertyTypeCount,
  getPropertyByListedForCount,
  getPropertyList,
  updatePropertyShootSchedule,
  insertHomeLoan,
  getHomeLoan,
  deleteHomeLoan,
  getUserFieldVisitRequest,

  insertFavouriteProperty,
  getFavouriteProperty
};
