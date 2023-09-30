const { wrapAwait } = require("../../errorHandling");
const { getApartmentByID } = require("../../models/services/property/service.apartment");
const { getHouseByID } = require("../../models/services/property/service.house");
const { getLandByID } = require("../../models/services/property/service.land");
const { getPropertyWithAds, getLatestProperty, getProperty, getPropertyPriorityLocation, getLatestPropertyPriorityLocation, insertPropertyShootSchedule, getPropertyShootSchedule, insertPropertyShootScheduleComment, getPropertyShootScheduleComment, insertPropertyFieldVisitRequest, getPropertyFieldVisitRequest, getPropertyFieldVisitRequestByID, updatePropertyFieldVisitRequest, insertPropertyFieldVisitOTP, getPropertyFieldVisitOTP, insertPropertyFieldVisit, countListingProperty, getRequestProperty, insertRequestedProperty } = require("../../models/services/property/service.property");
const { findCustomer, registerCustomer } = require("../../models/services/users/service.customer");
const { getRandomNumber } = require("../../utils/helperFunction/helper");
const { handleErrorResponse, handleLimitOffset } = require("../controller.utils");

const generator = require("generate-password");
const bcrypt = require("bcrypt");
const { sendPasswordToStaff, sendPasswordEmail } = require("../../middlewares/middleware.sendEmail");
const logger = require("../../utils/errorLogging/logger");
const { findUserByEmail, registerUser } = require("../../models/services/users/service.user");

const handleGetPropertyWithAds = async function (req, res) {

  const [limit, offset] = handleLimitOffset(req)

  let condition = {};

  if (req.query.property_type) {
    condition.property_type = req.query.property_type
  }
  if (req.query.listed_for) {
    condition.listed_for = req.query.listed_for;
  }
  if (req.query.location) {
    condition.location = req.query.location;
  }


  console.log(condition)

  try {
    const data = await getPropertyWithAds(condition, limit, offset);
    const modifiedData = data.map(item => {
      return {
        ...item.dataValues,
        ads: {
          twitter: item.twitter,
          tiktok: item.tiktok,
          instagram: item.instagram,
          facebook: item.facebook,
          youtube: item.youtube
        },
        twitter: undefined,       // These lines will essentially remove the original properties
        tiktok: undefined,        // from the outer object
        instagram: undefined,
        facebook: undefined,
        youtube: undefined
      };
    });


    console.log(data);

    return res.status(200).json(modifiedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error " });
  }
}

const handleGetProperty = async function (req, res) {


  const [limit, offSet] = handleLimitOffset(req);

  try {
    const data = await getProperty(req.query, limit, offSet);
    console.log(data);
    //update views of property
    //await updateViewsCount()
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error " });
  }

}

const handleGetPropertyPriorityLocation = async function (req, res) {


  const [limit, offSet] = handleLimitOffset(req);

  // get condition
  let district = req.body?.district ? req.body.district : null;
  let condition = req.query ? req.query : null;
  let location = req.query?.location ? req.query.location : null;
  let minPrice = req.query?.minPrice ? req.query.minPrice : null;
  let maxPrice = req.query?.maxPrice ? req.query.maxPrice : null
  condition.district = district;
  condition.location = location;

  condition.priceRange = {}
  if (minPrice) {
    condition.priceRange.minPrice = minPrice;
    delete condition.minPrice;
  }
  if (maxPrice) {
    condition.priceRange.maxPrice = maxPrice;
    delete condition.maxPrice;
  }


  console.log(condition)


  try {
    const data = await getLatestPropertyPriorityLocation(condition, limit, offSet);
    console.log(data);
    //update views of property
    //await updateViewsCount()
    return res.status(200).json(data);
  } catch (error) {

    console.log(error);
    handleErrorResponse(res, error);
    // return res.status(500).json({ message: "Internal Error " });
  }

}



const handleInsertPropertyFieldVisitRequest = async function (req, res) {

  let { name, email, contact, property_id, property_type, request_date } = req.body;

  let user = null;
  if (req.id && req.user_type === 'agent' || req.user_type === 'customer') {
    user.user_id = req.id;
  } else if (!req.id || req.user_type !== 'customer') { // this handle customer with login and admin
    if (!email || !name || !contact) {
      return res.status(400).json({ message: "Bad Request" })
    }

    try {
      const findUser = await findCustomer(email);
      if (findUser) {
        user = findUser.dataValues;
      }

      if (!findUser) {
        //create user
        const password = generator.generate({ length: 10, numbers: true });

        const [hashPassword, hashPasswordError] = await wrapAwait(
          bcrypt.hash(password, 10)
        );
        if (hashPasswordError) {
          handleErrorResponse(res, hashPasswordError)
        }
        const userData = {
          user_type: "customer",
          name: name,
          email: email,
          phone_number: contact,
          password: hashPassword
        }
        const accountResponse = await registerCustomer(userData);

        console.log("Account Created", accountResponse);
        if (accountResponse?.dataValues) {
          user = accountResponse.dataValues;
          sendPasswordEmail(accountResponse.dataValues.email, password).catch((err) => {
            logger.error("Error While Send Email ", err)
            console.log("Error while send Email ", email)
          })
        }
      }

    } catch (error) {
      handleErrorResponse(res, error)
    }



    try {
      const data = await insertPropertyFieldVisitRequest({
        user_id: user.user_id,
        property_id,
        property_type,
        request_date
      })
      console.log(data);
      return res.status(200).json({ message: "created Property Field Visit Request " })
    } catch (error) {
      handleErrorResponse(res, error);
    }

  }
}

const handleGetPropertyFieldVisitRequest = async function (req, res) {

  const [limit, offset] = handleLimitOffset(req);

  let searchQuery = req?.query?.search;

  try {
    const response = await getPropertyFieldVisitRequest(searchQuery, limit, offset);
    console.log(response)
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error)
  }

}

const handleGetPropertyFieldVisitRequestByID = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;

  const propertyRequest = {
    house: getHouseByID,
    land: getLandByID,
    apartment: getApartmentByID,
  }

  try {
    const response = await getPropertyFieldVisitRequestByID(field_visit_id);

    console.log(response.dataValues)
    let propertyResponse = {};
    let ownerResponse = {};
    if (response?.dataValues) {
      const getProperty = propertyRequest[`${response.dataValues?.property_type}`];
      propertyResponse = await getProperty(response.dataValues.property_id, ['area_name', 'ward', 'municipality', 'owner_id']);
      if (propertyResponse?.dataValues) {
        // write code for get User / owner
      }
    }
    const finalResponse = Object.assign({}, response?.dataValues, propertyResponse?.dataValues)
    console.log(finalResponse)
    return res.status(200).json(finalResponse);
  } catch (error) {
    handleErrorResponse(res, error)
  }
}

const handleUpdatePropertyFieldVisitRequest = async function (req, res) {

  const field_visit_id = req.params?.field_visit_id;



  console.log(req.body)

  const updateCondition = {};

  if (req.body?.status) {
    updateCondition.status = req.body.status;
  }
  if (req.body?.visit_status) {
    updateCondition.visit_status = req.body.visit_status
  }
  if (req.body?.schedule_date) {
    updateCondition.schedule_date = req.body.schedule_date;
  }

  if (Object.keys(updateCondition).length === 0) {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    const response = await updatePropertyFieldVisitRequest(updateCondition, field_visit_id)
    if (response['0'] === 1) {
      if (updateCondition?.visit_status === 'schedule') {
        console.log(updateCondition)
        const updateRequest = await getPropertyFieldVisitRequestByID(field_visit_id, ['user_id', 'property_id', 'property_type', 'visit_status']);


        console.log(updateRequest)
        if (updateRequest?.dataValues?.visit_status === 'schedule') {
          const otp = getRandomNumber(100000, 999999);
          console.log(otp)
          const otpInsert = {
            field_visit_id: field_visit_id,
            customer_id: updateRequest.dataValues.user_id,
            otp: otp,
            property_id: updateRequest.dataValues.property_id,
            property_type: updateRequest.dataValues.property_type
          }

          const insertOTPResponse = await insertPropertyFieldVisitOTP(otpInsert);

        }

      }

    }

    return res.status(200).json({ message: "Update Successfull" });

  } catch (error) {
    handleErrorResponse(res, error)
  }



}

const handleDeletePropertyFieldVisiteRequest = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;

  try {
    const response = await deletePropertyFieldVisit(field_visit_id);
    if (response === 0) {
      return res.status(404).json({ message: `Field Visit Request Not Found` })
    }
    return res.status(200).json({ message: "Delete Successfull" })
  } catch (error) {
    handleErrorResponse(res, error)
  }
}


const handleGetPropertyFieldVisitOTP = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;

  try {
    const response = await getPropertyFieldVisitOTP(field_visit_id);
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res, error)
  }
}

const handleMatchPropertyFieldVisitOTP = async function (req, res) {
  const field_visit_id = req.params?.field_visit_id;
  const otp = req.body?.otp;
  if (!otp) {
    return res.status(400).json({ message: "Please Provide OTP" })
  }

  try {
    const response = await getPropertyFieldVisitOTP(field_visit_id);
    if (Array.isArray(response)) {
      if (response.length === 0) {
        return res.status(400).json({ message: "OTP not found" })
      }
    }
    if (!response) {
      return res.status(400).json({ message: "OTP not found" })
    }

    if (response.dataValues.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    const fieldVisit = {
      field_visit_id: response.dataValues.field_visit_id,
      customer_id: response.dataValues.customer_id,
      property_id: response.dataValues.property_id,
      property_type: response.dataValues.property_type
    }

    insertPropertyFieldVisit(fieldVisit).then((instance) => {
      console.log("This is instance", instance);
    });

    return response.status(200).json({ message: "OTP Match" })


  } catch (error) {

  }
}

const handleInsertPropertyShootSchedule = async function (req, res) {
  const { property_type, listed_for, location, owner, contact, scheduled_date } = req.body;

  try {
    const response = await insertPropertyShootSchedule({ property_type, listed_for, location, owner, contact, scheduled_date });
    console.log(response);
    return res.status(200).json({ message: "Insert Property Shoot Schedule" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
}

const handleGetPropertyShootSchedule = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  let condition = {};

  try {
    const response = await getPropertyShootSchedule(condition, limit, offset);


    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res, error)
  }
}

const handleInsertPropertyShootScheduleComment = async function (req, res) {
  let admin_id = req.id;
  let shoot_schedule_id = req.params.shoot_schedule_id;
  let { comment } = req.body;

  console.log(admin_id, shoot_schedule_id, comment);

  try {
    const response = await insertPropertyShootScheduleComment(shoot_schedule_id, admin_id, comment);
    return res.status(200).json({ message: "Comment Insert Successfull" });
  } catch (error) {
    handleErrorResponse(res, error)
  }
}


const handleGetPropertyShootScheduleComment = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);
  let shoot_schedule_id = req.params.shoot_schedule_id;
  if (!shoot_schedule_id) {
    return res.status(400).json({ message: "Please Select Shoot Schedule" });
  }
  try {
    const response = await getPropertyShootScheduleComment(shoot_schedule_id, limit, offset);
    console.log(response) // response in array
    if (response.length === 0) {
      return res.status(400).json({ message: "Bad Request" })
    }
    return res.status(200).json(response)
  } catch (error) {
    handleErrorResponse(res, error)
  }
}


const handleCountLisitingProperty = async function (req, res) {
  const condition = {};
  if (req.id && req.user_type === 'customer' || req.user_type === 'agent') {
    condition.owner_id = req.id;
  }
  try {
    const response = await countListingProperty(condition);
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }

}

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
    contact,
    ...otherDetails // This will contain all properties not listed above
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
    contact,
    property_details:otherDetails
  }

  let user = null;
  // requested by user 
  if (req.id && req.user_type === 'agent' || req.user_type === 'customer') {
    user.user_id = req.id;
  } else if (!req.id) { // this handle customer without login and admin
    if (!requestedProperty.email || !requestedProperty.name || !requestedProperty.contact) {
      return res.status(400).json({ message: "Bad Request" })
    }
  }
  try {
    if (!user) {
      //find user or  create user
      const customer = await findUserByEmail(requestedProperty.email);
      
      if (!customer) {
        const password = generator.generate({ length: 10, numbers: true });
        const [hashPassword, hashPasswordError] = await wrapAwait(
          bcrypt.hash(password, 10)
        );
        if (hashPasswordError) {
          handleErrorResponse(res, hashPasswordError)
        }

        const customerData = {
          user_type: "customer",
          name: requestedProperty.name,
          email: requestedProperty.email,
          phone_number: requestedProperty.contact,
          password: hashPassword
        }
        console.log(customerData)
        const accountResponse = await registerUser("customer", customerData.name, customerData.email, customerData.phone_number, customerData.password);
        console.log("Account Created", accountResponse);
        if (accountResponse?.dataValues) {
          user = accountResponse.dataValues;
          sendPasswordEmail(accountResponse.dataValues.email, password).catch((err) => {
            logger.error("Error While Send Email ", err)
            console.log("Error while send Email ", email)
          })
        }
      }else{
        user = customer.dataValues;
      }
    }
  } catch (error) {
    return handleErrorResponse(res,error);
  }
  console.log("User Found Or create",user)
  if(!user)return res.status(500).json({message:"Unable Process Request"})
  // delete name , email ,contact from requested Proeprty
  delete requestedProperty.name;
  delete requestedProperty.email;
  delete requestedProperty.contact;
  // add user id to requested property
  requestedProperty.user_id = user.id;
  try {
    const data = await insertRequestedProperty(requestedProperty);
    return res.status(200).json({ message: "Successfully Inserted" });
  } catch (error) {
    handleErrorResponse(res,error)
  }




}

const handleGetRequestProperty = async function (req, res) {
  const [limit, offset] = handleLimitOffset(req);

  let searchQuery = {};

  try {
    const response = await getRequestProperty(searchQuery, limit, offset);
    console.log(response)
    return res.status(200).json(response);
  } catch (error) {
    handleErrorResponse(res, error)
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
  handleInsertPropertyShootScheduleComment,
  handleGetPropertyShootScheduleComment,
  handleCountLisitingProperty,
  handleGetRequestProperty,
  handleInsertRequestedProperty
}