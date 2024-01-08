const { wrapAwait } = require("../../errorHandling");
const {
  getApartmentByID,
  getApartmentWithOwnerByID,
  getPendingApartment,
} = require("../../models/services/property/service.apartment");
const {
  getHouseByID,
  getHouseWithOwnerByID,
  getPendingHouse,
  getHouseFavourite,
} = require("../../models/services/property/service.house");
const {
  getLandByID,
  getLandWithOwnerByID,
  getPendingLand,
  getLandFavourite,
} = require("../../models/services/property/service.land");
const {
  getPropertyWithAds,
  getLatestProperty,
  getProperty,
  getPropertyPriorityLocation,
  getLatestPropertyPriorityLocation,
  insertPropertyShootSchedule,
  getPropertyShootSchedule,
  insertPropertyShootScheduleComment,
  getPropertyShootScheduleComment,
  insertPropertyFieldVisitRequest,
  getPropertyFieldVisitRequest,
  getPropertyFieldVisitRequestByID,
  updatePropertyFieldVisitRequest,
  insertPropertyFieldVisitOTP,
  getPropertyFieldVisitOTP,
  insertPropertyFieldVisit,
  countListingProperty,
  getRequestProperty,
  insertRequestedProperty,
  deleteRequestedProperty,
  deletePropertyShootSchedule,
  insertPropertyFieldVisitComment,
  deletePropertyFieldVisitRequest,
  getRequestPropertyByID,
  getSoldProperty,
  getEveryMonthSoldProperty,
  getSoldPropertyByPropertyTypeCount,
  getSoldPropertyByListedForCount,
  getPropertyByPropertyTypeCount,
  getPropertyByListedForCount,
  getPropertyList,
  getPropertyWithOwner,
  updatePropertyShootSchedule,
  insertHomeLoan,
  getHomeLoan,
  deleteHomeLoan,
  getUserFieldVisitRequest,
  insertFavouriteProperty,
  getFavouriteProperty,
  deleteFavouriteProperty,
} = require("../../models/services/property/service.property");
const {
  findCustomer,
  registerCustomer,
} = require("../../models/services/users/service.customer");
const { getRandomNumber } = require("../../utils/helperFunction/helper");
const {
  handleErrorResponse,
  handleLimitOffset,
} = require("../controller.utils");

const generator = require("generate-password");
const bcrypt = require("bcrypt");
const {
  sendPasswordToStaff,
  sendPasswordEmail,
} = require("../../middlewares/middleware.sendEmail");
const logger = require("../../utils/errorLogging/logger");
const {
  findUserByEmail,
  registerUser,
  findUserByID,
} = require("../../models/services/users/service.user");
const {
  insertNotification,
} = require("../../models/services/notification/service.notification");




const handleGetPropertyWithAds = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);

  let condition = {};

  if (req.query.property_type) {
    condition.property_type = req.query.property_type;
  }
  if (req.query.listed_for) {
    condition.listed_for = req.query.listed_for;
  }
  if (req.query.location) {
    condition.location = req.query.location;
  }
  condition.status = "approved";
  console.log(condition);

  try { 
    //const [data,totalCount] = await Promise.all([getPropertyWithAds(condition,limit,offset),countListingProperty(condition)])
    const response = await getPropertyWithAds(condition, limit, offset);
    console.log(response);

    const { rows: data, count: totalCount } = response;

    
    const properties = data.map((property) => ({
      ...property,
      ads: {
        twitter: property.twitter,
        tiktok: property.tiktok,
        instagram: property.instagram,
        facebook: property.facebook,
        youtube: property.youtube,
      },
      // Remove the individual social media properties from the main object
      twitter: undefined,
      tiktok: undefined,
      instagram: undefined,
      facebook: undefined,
      youtube: undefined,
    }));
    

    return res.status(200).json({properties,totalCount});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error " });
  }
};

const handleGetProperty = async function (req, res) {
  const [limit, offSet] = handleLimitOffset(req);
  let condition = {
    status: "approved",
    ...req.query,
  };

  try {
    const data = await getProperty(condition, limit, offSet);
    console.log(data);
    //update views of property
    //await updateViewsCount()
    return res.status(200).json(data);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetPropertyPriorityLocation = async function (req, res) {
  const [limit, offSet] = handleLimitOffset(req);

  // get condition
  let district = req.body?.district ? req.body.district : null;
  let condition = req.query ? req.query : null;
  let location = req.query?.location ? req.query.location : null;
  let minPrice = req.query?.minPrice ? req.query.minPrice : null;
  let maxPrice = req.query?.maxPrice ? req.query.maxPrice : null;
  condition.district = district;
  condition.location = location;
  condition.status = "approved";

  // sort condition
  if (req.query?.sort === "price" || req.query?.sort === "views") {
    condition.sort = req.query.sort;
    if (req.query?.order) {
      condition.order = req.query.order;
    }
  }
  condition.priceRange = {};
  if (minPrice) {
    condition.priceRange.minPrice = minPrice;
    delete condition.minPrice;
  }
  if (maxPrice) {
    condition.priceRange.maxPrice = maxPrice;
    delete condition.maxPrice;
  }

  if ((req.id && req.user_type === "customer") || req.user_type === "agent") {
    condition.owner_id = req.id;
  }
  try {
    const data = await getLatestPropertyPriorityLocation(
      condition,
      limit,
      offSet
    );
    console.log(data.properties);
    //update views of property
    //await updateViewsCount()
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
    // return res.status(500).json({ message: "Internal Error " });
  }
};

const handleInsertPropertyFieldVisitRequest = async function (req, res) {
  try {
    let { name, email, phone_number, property_id, property_type, request_date } =
      req.body;

    if (!property_id || !property_type || !request_date) {
      return res.status(400).json({ message: "Bad Request" });
    }

    let user = {};

    if ((req.id && req.user_type === "agent") || req.user_type === "customer") {
      user.id = req.id;
    }

    if (req.id && req.user_type === "admin") {
      // this handle customer with login and admin
      if (!email || !name || !phone_number) {
        return res.status(400).json({ message: "Bad Request" });
      }
      let findUser = await findUserByEmail("customer", email);
      if(!findUser){
        return res.status(400).json({message:"User Not Found"})
      }
      user.id = findUser?.dataValues?.id;
    }
    const data = await insertPropertyFieldVisitRequest({
      user_id: user.id,
      property_id,
      property_type,
      request_date,
    });

    console.log(data);

    return res
      .status(200)
      .json({ message: "created Property Field Visit Request " });
  } catch (error) {
     handleErrorResponse(res, error);
  }
};


const handleGetPropertyFieldVisitRequest = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  condition = {};
  //if request from user
  if ((req.id && req.user_type === "customer") || req.user_type === "agent") {
    condition.user_id = req.id;
  }
  let searchQuery = req?.query?.search;
  if(searchQuery){
    condition.search = searchQuery;
    delete req.query.search;
  }


  try {
    const response = await getPropertyFieldVisitRequest(
      condition,
      limit,
      offset
    );
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

const handleGetUserFieldVisitRequest = async function (req,res){
  const user_id = req.id;
  const [limit,offset] = handleLimitOffset(req);
  try {
    const response = await getUserFieldVisitRequest({user_id},limit,offset);
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res,error)
  }
}


const handleGetPropertyFieldVisitRequestByID = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;

  if (!field_visit_id) {
    return res.status(400).json({ message: "Bad Request" });
  }

  //get property function
  const getProperty = {
    apartment: getApartmentWithOwnerByID,
    house: getHouseWithOwnerByID,
    land: getLandWithOwnerByID,
  };

  try {
    const result = await getPropertyFieldVisitRequestByID(field_visit_id);
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: "Field Visit Request Not Found" });
    }
    const property = await getProperty[result.dataValues.property_type](
      result.dataValues.property_id
    );
    if (!property) {
      return res.status(404).json({ message: "Property Not Found" });
    }
    const response = { ...result.dataValues, ...property.dataValues };
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleUpdatePropertyFieldVisitRequest = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;

  console.log(req.body);

  const updateCondition = {};

  if (req.body?.schedule_date) {
    updateCondition.schedule_date = req.body.schedule_date;
    updateCondition.visit_status = "schedule";
    updateCondition.status = "approve";

  }
  if (Object.keys(updateCondition).length === 0) {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    const response = await updatePropertyFieldVisitRequest(
      updateCondition,
      field_visit_id
    );
    console.log(response);
    if (response["0"] === 1) {
      if (updateCondition?.visit_status === "schedule") {
        console.log(updateCondition);
        const updateRequest = await getPropertyFieldVisitRequestByID(
          field_visit_id,
          ["user_id", "property_id", "property_type", "visit_status"]
        );

        console.log(updateRequest);
        if (updateRequest?.dataValues?.visit_status === "schedule" &&
        updateRequest?._previousDataValues?.visit_status !== "schedule") {
          const otp = getRandomNumber(100000, 999999);
          console.log(otp);
          const otpInsert = {
            field_visit_id: field_visit_id,
            customer_id: updateRequest.dataValues.user_id,
            otp: otp,
            property_id: updateRequest.dataValues.property_id,
            property_type: updateRequest.dataValues.property_type,
          };

          const insertOTPResponse = await insertPropertyFieldVisitOTP(
            otpInsert
          );
        }
      }
    }

    return res.status(200).json({ message: "Update Successfull" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleInsertPropertyFieldVisitRequestComment = async function (req, res) {
  let user_id = req.id; // user will only comment
  let field_visit_id = req.params.field_visit_id;
  let { comment } = req.body;

  console.log(user_id, field_visit_id, comment);

  try {
    const response = await insertPropertyFieldVisitComment(
      field_visit_id,
      user_id,
      comment
    );
    console.log(response);
    return res.status(200).json({ message: "Comment Insert Successfull" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleDeletePropertyFieldVisiteRequest = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;

  try {
    const response = await deletePropertyFieldVisitRequest(field_visit_id);
    if (response === 0) {
      return res.status(404).json({ message: `Field Visit Request Not Found` });
    }
    return res.status(200).json({ message: "Delete Successfull" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetPropertyFieldVisitOTP = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;
  if (!field_visit_id) {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    const response = await getPropertyFieldVisitOTP(field_visit_id);
    if (!response) {
      return res.status(404).json({ message: "OTP Not Found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleMatchPropertyFieldVisitOTP = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;
  const otp = req.body?.otp;
  if (!otp) {
    return res.status(400).json({ message: "Please Provide OTP" });
  }
  try {
    const response = await getPropertyFieldVisitOTP(field_visit_id);
    if (Array.isArray(response)) {
      if (response.length === 0) {
        return res.status(400).json({ message: "OTP not found" });
      }
    }
    if (!response) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (response.dataValues.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // update property field visit request to visited
    const updateVisitStatusResponse = await updatePropertyFieldVisitRequest({visit_status:"visited"},field_visit_id)
    console.log(updateVisitStatusResponse);
    return response.status(200).json({ message: "OTP Match" });
  } catch (error) {
    handleErrorResponse(res,error)
  }
};

const handleInsertPropertyShootSchedule = async function (req, res) {
  const {
    property_type,
    listed_for,
    location,
    owner,
    contact,
    scheduled_date,
    longitude,
    latitude,
  } = req.body;

  try {
    const response = await insertPropertyShootSchedule({
      property_type,
      listed_for,
      location,
      owner,
      contact,
      scheduled_date,
      longitude,
      latitude,
    });
    console.log(response);
    const notification = {
      user_id: req.id,
      user_type: req.user_type,
      notification: `Property Shoot Schedule Request`,
      url: `/admin/property/shoot-schedule/${response.dataValues.id}`,
    };

    insertNotification(notification)
      .then((instance) => {
        console.log("Notification Inserted", instance);
      })
      .catch((err) => {
        console.log("Error While Insert Notification", err);
      });
    return res.status(200).json({ data:response,message: "Insert Property Shoot Schedule" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetPropertyShootSchedule = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  let condition = {};
  if (req.query?.search) {
    condition.search = req.query.search.trim();
  }
  if(req.query?.shoot_status){
    condition.shoot_status = req.query.shoot_status;
  }else{
    condition.shoot_status="scheduled"
  }

  try {
    const response = await getPropertyShootSchedule(condition, limit, offset);

    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleUpdatePropertyShootSchedule = async function(req,res){
  let {shoot_status} = req.body;
  let id = req.params.id;
  if(!shoot_status || !id){
    return res.status(400).json({message:"Please Provide Shoot Status"})
  }
  try {
    const response = await updatePropertyShootSchedule({shoot_status},id)
    let responseObject={
      shoot_status:shoot_status,
      id:id
    }
    return res.status(200).json({data:responseObject,message:"Update Successfull"})
  } catch (error) {
   handleErrorResponse(res,error) 
  }
}

const handleDeletePropertyShootSchedule = async function (req, res) {
  const shoot_schedule_id = req.params?.shoot_schedule_id;
  if (!shoot_schedule_id) {
    return res.status(400).json({ message: "Bad Request" });
  }
  try {
    const response = await deletePropertyShootSchedule(shoot_schedule_id);
    if (response === 0) {
      return res.status(404).json({ message: "Shoot Schedule Not Found" });
    }
    const responseObject = {
      id: shoot_schedule_id,
    }
    return res.status(200).json({data:responseObject, message: "Delete Successfull" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleInsertPropertyShootScheduleComment = async function (req, res) {
  let admin_id = req.id;
  let shoot_schedule_id = req.params.shoot_schedule_id;
  let { comment } = req.body;

  console.log(admin_id, shoot_schedule_id, comment);

  try {
    const response = await insertPropertyShootScheduleComment(
      shoot_schedule_id,
      admin_id,
      comment
    );
    console.log(response);
    return res.status(200).json({ message: "Comment Insert Successfull" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetPropertyShootScheduleComment = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  let shoot_schedule_id = req.params.shoot_schedule_id;
  if (!shoot_schedule_id) {
    return res.status(400).json({ message: "Please Select Shoot Schedule" });
  }
  try {
    const response = await getPropertyShootScheduleComment(
      shoot_schedule_id,
      limit,
      offset
    );
    console.log(response); // response in array
    if (response.length === 0) {
      return res.status(400).json({ message: "Bad Request" });
    }
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleCountLisitingProperty = async function (req, res) {
  const condition = {};
  if ((req.id && req.user_type === "customer") || req.user_type === "agent") {
    condition.owner_id = req.id;
  }
  try {
    const response = await countListingProperty(condition);
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleInsertRequestedProperty = async function (req, res) {
  const {
    property_type,
    request_for,
    province,
    district,
    area_name,
    name,
    email,
    address,
    phone_number,
    otherDetails, // This will contain all properties not listed above
  } = req.body;
  if(!property_type || !request_for || !province || !district || !area_name){
    return res.status(400).json({message:"Please Provide Property Information"})
  }

  const requestedProperty = {
    property_type,
    request_for,
    province,
    district,
    area_name,
    name,
    email,
    address,
    phone_number: phone_number,
    property_details: otherDetails,
  };
  
  // if request by agent or customer 
  if(req.id && req.user_type === "agent" || req.user_type === "customer"){
    requestedProperty.user_id = req.id;
  }else{
    //request is made by admin
    if(!name || !email || !phone_number){
      return res.status(400).json({message:"Please Owner Provide Information"})
    }
    const user = await findUserByEmail("customer",email);
    if(!user){
      return res.status(400).json({message:"User Not Found"})
    }
    requestedProperty.user_id = user?.dataValues.id;
  }
  try {
    const data = await insertRequestedProperty(requestedProperty);
    return res.status(200).json({ message: "Successfully Inserted" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetRequestProperty = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);

  let condition = {};
  if (req.query?.search) {
    condition.search = req.query.search.trim();
  }

  try {
    const response = await getRequestProperty(condition, limit, offset);
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetRequestPropertyByID = async function (req, res) {
  const request_id = req.params?.request_id;

  try {
    const response = await getRequestPropertyByID(request_id);
    if (!response) {
      return res.status(404).json({ message: "Request Not Found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleDeleteRequestedProperty = async function (req, res) {
  const request_id = req.params?.request_id;

  try {
    const deleteResponse = await deleteRequestedProperty(request_id);
    if (deleteResponse === 0) {
      return res.status(404).json({ message: "Request Not Found" });
    }
    return res.status(200).json({ message: "Delete Successfull" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetSoldProperty = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  const condition = {};
  if (req.query?.property_type) {
    condition.property_type = req.query.property_type;
  }
  if (req.query?.listed_for) {
    condition.listed_for = req.query.listed_for;
  }
  if (req.query?.search) {
    condition.search = req.query.search.trim();
  }
  condition.status='sold';
  try {
    const response = await getPropertyWithAds(condition, limit, offset);
    const { rows: soldProperty, count: totalCount } = response;
    return res.status(200).json({properties:soldProperty,totalCount});
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetPendingProperty = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  const condition = {};
  condition.status = "pending";
  if (req.query?.property_type) {
    condition.property_type = req.query.property_type;
  }
  if (req.query?.listed_for) {
    condition.listed_for = req.query.listed_for;
  }
  if (req.query?.location) {
    condition.location = req.query.location.trim();
  }
  try {
    const response = await getPropertyWithOwner(condition, limit, offset);
    //const data = await getProperty(condition, limit, offset);
    const { rows: properties, count: totalCount } = response;
   
    return res.status(200).json({properties,totalCount});
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetPropertyAnalytics = async function (req, res) {
  try {
    const [everyMonthSoldProperty, propertyTypeCount, propertyListedForCount] =
      await Promise.all([
        getEveryMonthSoldProperty(),
        getPropertyByPropertyTypeCount(),
        getPropertyByListedForCount(),
      ]);
    console.log(everyMonthSoldProperty);
    return res
      .status(200)
      .json({
        everyMonthSoldProperty,
        propertyTypeCount,
        propertyListedForCount,
      });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleGetPropertyList = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  const property_type = req.query?.propertyType;
  const condition = {};
  condition.property_type = property_type;

  try {
    const propertyList = await getPropertyList(condition, limit, offset);
    return res.status(200).json(propertyList);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const handleInsertHomeLoan = async (req,res)=>{
  const {loan_amount,property_id,property_type} = req.body;
  const user_id = req.id;

  if( !loan_amount || !property_id || !property_type || !user_id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await insertHomeLoan({
      user_id,
      loan_amount,
      property_id,
      property_type,
     
    })

    return res.status(200).json({message:"Successfully Inserted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleGetHomeLoan = async (req,res)=>{
  let condition = {};
  const [limit,offset] = handleLimitOffset(req);
  if(req.query){
    condition = req.query;
  }
  try {
    const response = await getHomeLoan(condition,limit,offset);
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleDeleteHomeLoan = async (req,res)=>{
  const {id} = req.params;
  if(!id){
    return res.status(400).json({message:"Bad Request"});
  }

  try {
    const response = await deleteHomeLoan(id);
    return res.status(200).json({message:"Successfully Deleted"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleInsertFavouriteProperty = async function(req,res){

  const user_id = req.id;
  const property_id = req.params.property_id;
  const property_type = req.body?.property_type;
  if(!property_id || !property_type){
    return res.status(400).json({message:"Bad Request"})
  }
try {
    const response = await insertFavouriteProperty({
      property_id,
      property_type,
      user_id
    })
    return res.status(200).json({message:"Successfully Inserted"})
} catch (error) {
  handleErrorResponse(res,error)
}
}

// get all favourite proeprty - need to think processss

const handleGetFavouriteProperty = async function (req,res){
  // get all property id and property type from favourite table , and search in corresponding table
  // house , apartment , land;
  
  // find property_id and property_type from favourite table
  const [limit,offset] = handleLimitOffset(req);
  const {count , rows:favouriteProperty} = await getFavouriteProperty({user_id:req.id},limit,offset);
  console.log(favouriteProperty);
  if(favouriteProperty.length === 0){
    return res.status(404).json({message:"No Favourite Property Found"})
  }
  // loop through favourite property and find property
  let properties =[];
  await Promise.all(favouriteProperty.map(async (property)=>{
    const {property_id,property_type} = property;
    const {properties:propertyData,totalCount} =  await getLatestPropertyPriorityLocation({property_id,property_type});
     properties.push(propertyData[0]?.dataValues);
  }))
  
  return res.status(200).json({properties,totalCount:count})
}

const handleIsPropertyFavourite = async function(req,res){
  const user_id = req.id;
  const property_id = req.params.property_id;
  const property_type = req.params?.property_type;
  console.log(property_id,property_type)
  if(!property_id && !property_type){
    return res.status(400).json({message:"Bad Request"})
  }
  
  try {
    const {count,rows} = await getFavouriteProperty({user_id,property_id,property_type});
   
    if(count === 0){
      return res.status(400).json({message:"Not Favourite",isFavourite:false})
    }
    return res.status(200).json({
      isFavourite:true,
      message:"Favourite"
    })
    //return res.status(200).json({message:"Favourite"})
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

const handleDeleteFavouriteProperty = async function(req,res){
  const user_id = req.id;
  const property_id = req.params.property_id;
  const property_type = req.body?.property_type;
  if(!property_id && !property_type){
    return res.status(400).json({message:"Bad Request"})
  }
  console.log(property_id,property_type)
  try {
    const deletedFavourite = await deleteFavouriteProperty({user_id,property_id,property_type});
    console.log(deletedFavourite);
    if(deletedFavourite === 0){
      return res.status(400).json({message:"Not Favourite"})
    }
    return res.status(200).json({message:"Successfully Deleted"})
    
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

module.exports = {
  handleGetPropertyWithAds,
  handleGetProperty,
  handleGetPropertyPriorityLocation,
  handleInsertPropertyFieldVisitRequest,
  handleUpdatePropertyFieldVisitRequest,
  handleGetPropertyFieldVisitRequest,
  handleGetPropertyFieldVisitRequestByID,
  handleDeletePropertyFieldVisiteRequest,
  handleGetPropertyFieldVisitOTP,
  handleMatchPropertyFieldVisitOTP,
  handleInsertPropertyShootSchedule,
  handleGetPropertyShootSchedule,
  handleDeletePropertyShootSchedule,
  handleInsertPropertyShootScheduleComment,
  handleGetPropertyShootScheduleComment,
  handleCountLisitingProperty,
  handleGetRequestProperty,
  handleGetRequestPropertyByID,
  handleInsertRequestedProperty,
  handleDeleteRequestedProperty,
  handleGetSoldProperty,
  handleGetPendingProperty,
  handleGetPropertyAnalytics,
  handleGetPropertyList,
  handleUpdatePropertyShootSchedule,
  handleInsertHomeLoan,
  handleGetHomeLoan,
  handleDeleteHomeLoan,
  handleGetFavouriteProperty,
  handleGetUserFieldVisitRequest,
  handleInsertFavouriteProperty,
  handleIsPropertyFavourite,
  handleDeleteFavouriteProperty

};
