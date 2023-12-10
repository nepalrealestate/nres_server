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
} = require("../../models/services/property/service.house");
const {
  getLandByID,
  getLandWithOwnerByID,
  getPendingLand,
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
    const [data,totalCount] = await Promise.all([getPropertyWithAds(condition,limit,offset),countListingProperty(condition)])
    
    
    const properties = data.map((property) => ({
      ...property.dataValues,
      ads: {
        twitter: property.dataValues.twitter,
        tiktok: property.dataValues.tiktok,
        instagram: property.dataValues.instagram,
        facebook: property.dataValues.facebook,
        youtube: property.dataValues.youtube,
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
  let { name, email, contact, property_id, property_type, request_date } =
    req.body;
  console.log(req.body);

  if(!property_id && !property_type){
    return res.status(400).json({message:"Please Select Property"});
  }

  let user = null;
  if ((req.id && req.user_type === "agent") || req.user_type === "customer") {
    user.user_id = req.id;
  } else if (!req.id || req.user_type !== "customer") {
    // this handle customer with login and admin
    if (!email || !name || !contact) {
      return res.status(400).json({ message: "Bad Request" });
    }

    try {
      console.log("Email before send", email);
      const findUser = await findUserByEmail("customer", email);
      if (findUser) {
        user = findUser.dataValues;
      }

      if (!findUser) {
        //create user
        console.log("User Not Found", findUser);
        const password = generator.generate({ length: 10, numbers: true });

        const [hashPassword, hashPasswordError] = await wrapAwait(
          bcrypt.hash(password, 10)
        );
        if (hashPasswordError) {
          return handleErrorResponse(res, hashPasswordError);
        }
        const customerData = {
          user_type: "customer",
          name: name,
          email: email,
          phone_number: contact,
          password: hashPassword,
        };
        console.log(customerData);
        const accountResponse = await registerUser(customerData);

        console.log("Account Created", accountResponse);
        if (accountResponse?.dataValues) {
          user = accountResponse.dataValues;
          sendPasswordEmail(accountResponse.dataValues.email, password).catch(
            (err) => {
              logger.error("Error While Send Email ", err);
              console.log("Error while send Email ", email);
            }
          );
        }
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }

    try {
      console.log("this is User",user);
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
  }
};

const handleGetPropertyFieldVisitRequest = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);

  let searchQuery = req?.query?.search;

  try {
    const response = await getPropertyFieldVisitRequest(
      searchQuery,
      limit,
      offset
    );
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

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
    province,
    district,
    municipality,
    area_name,
    ward,
    name,
    email,
    address,
    phone_number,
    otherDetails, // This will contain all properties not listed above
  } = req.body;

  const requestedProperty = {
    property_type,
    province,
    district,
    municipality,
    area_name,
    ward,
    name,
    email,
    address,
    contact: phone_number,
    property_details: otherDetails,
  };
  console.log("this is request body", req.body);
  console.log(requestedProperty);
  let user = null;
  // requested by user
  if ((req.id && req.user_type === "agent") || req.user_type === "customer") {
    const userData = await findUserByID(req.user_type, req.id);
    if(!userData){
      return res.status(400).json({message:"Please Provide Information"})
    }
    requestedProperty.name = userData?.dataValues?.name;
    requestedProperty.email = userData?.dataValues?.email;
    requestedProperty.contact = userData?.dataValues?.phone_number;
  }  
    // this handle customer without login and admin
  if (
      !requestedProperty.email ||
      !requestedProperty.name ||
      !requestedProperty.contact   
   ) {
      return res.status(400).json({ message: "Bad Request" });
    }

    try {
      const data = await insertRequestedProperty(requestedProperty);
      return res.status(200).json({ message: "Successfully Inserted" });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  




  // try {
  //   if (!user) {
  //     //find user or  create user
  //     const customer = await findUserByEmail(requestedProperty.email);

  //     if (!customer) {
        // const password = generator.generate({ length: 10, numbers: true });
        // const [hashPassword, hashPasswordError] = await wrapAwait(
        //   bcrypt.hash(password, 10)
        // );
        // if (hashPasswordError) {
        //   handleErrorResponse(res, hashPasswordError);
        // }

        // const customerData = {
        //   user_type: "customer",
        //   name: requestedProperty.name,
        //   email: requestedProperty.email,
        //   phone_number: requestedProperty.contact,
        //   password: hashPassword,
        // };
        // console.log(customerData);
        // const accountResponse = await registerUser(
        //   "customer",
        //   customerData.name,
        //   customerData.email,
        //   customerData.phone_number,
        //   customerData.password
        // );
        // console.log("Account Created", accountResponse);
        // if (accountResponse?.dataValues) {
        //   user = accountResponse.dataValues;
        //   sendPasswordEmail(accountResponse.dataValues.email, password).catch(
        //     (err) => {
        //       logger.error("Error While Send Email ", err);
        //       console.log("Error while send Email ", email);
        //     }
        //   );
        // }
  //     } else {
  //       user = customer.dataValues;
  //     }
  //   }
  // } catch (error) {
  //   return handleErrorResponse(res, error);
  // }
  // console.log("User Found Or create", user);
  // if (!user) return res.status(500).json({ message: "Unable Process Request" });
  // // delete name , email ,contact from requested Proeprty
  // delete requestedProperty.name;
  // delete requestedProperty.email;
  // delete requestedProperty.contact;
  // // add user id to requested property
  // requestedProperty.user_id = user.id;
  
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
    const [soldProperty,totalCount] = await Promise.all([getProperty(condition,limit,offset),countListingProperty(condition)])
    
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
  if (req.query?.search) {
    condition.search = req.query.search.trim();
  }
  try {
    const [properties,totalCount] = await Promise.all([getPropertyWithOwner(condition,limit,offset),countListingProperty({status:"pending"})])
    //const data = await getProperty(condition, limit, offset);
   
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
  handleUpdatePropertyShootSchedule
};
