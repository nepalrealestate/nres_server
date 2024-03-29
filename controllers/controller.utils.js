const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const logger = require("../utils/errorLogging/logger");

const {
  sendPasswordResetTokenMail,
} = require("../middlewares/middleware.sendEmail");
const { wrapAwait } = require("../errorHandling");

const { validateSchema } = require("./validationSchema");
const {
  deleteFiles,
  deleteMultipleImages,
} = require("../middlewares/middleware.uploadFile");
const {
  insertNotification,
} = require("../models/services/notification/service.notification");
const {
  uploadMultipleOnCloudinary,
  deleteMultipleFromCloudinary,
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const { updateApartment } = require("../models/services/property/service.apartment");
const { updateHouse } = require("../models/services/property/service.house");
const { updateLand } = require("../models/services/property/service.land");

const saltRound = 10;

function userUtility(user_type) {
  const validTypes = ["staff", "superAdmin", "customer", "agent"];
  if (!validTypes.includes(user_type)) {
    throw new Error(`Invalid Property type: ${user_type}`);
  }

  const passwordToken = new Map();

  const forgetPassword = async function (req, res, user) {
    //const user_id = req.id;
    //after email verification
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    try {
      const randomToken = Math.floor(Math.random() * (9999 - 1000) + 1000);
      const expireTime = Date.now() + 5 * 60 * 1000;

      passwordToken.set(user.id, {
        token: randomToken,
        expireTime: expireTime,
      });
      console.log(passwordToken);

      sendPasswordResetTokenMail(user.email, randomToken)
        .then(function (data) {
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });

      return res
        .status(200)
        .json({ message: "OPT sucessfully Send . Check Your Email " });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };

  const passwordUpdate = async function (req, res, user, updatePasswordCB) {
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const { email, token } = req.query;
    const user_id = user.id;

    // if email field empty
    if (!email && !token) {
      return res.status(400).json({ message: "missing email or otp" });
    }

    // logic for update password
    const { password, confirmPassword } = req.body;
    // if password doesnot match
    if (password !== confirmPassword) {
      console.log(" New Password not match  ");
      return res.status(403).json({ message: " New Password  not match" });
    }

    const storeToken = passwordToken.get(user_id);
    console.log(storeToken);

    if (!storeToken) {
      return res.status(200).json({ message: "Please generate token again" });
    }
    if (storeToken.token !== Number(token)) {
      return res.status(400).json({ message: "No Token Match" });
    }

    // check expire date
    if (Date.now > storeToken.expireTime) {
      return res
        .status(400)
        .json({ message: "Token Expire ! please generate New Token" });
    }

    const [hashPassword, hashPasswordError] = await wrapAwait(
      bcrypt.hash(password, saltRound)
    );

    if (hashPassword) {
      // this updateUser password return result in array in form of resolve and reject
      const [passwordUpdate, passwordUpdateError] = await wrapAwait(
        updatePasswordCB(user.id, hashPassword)
      );
      if (passwordUpdate) {
        passwordToken.delete(user_id);
        return res.status(200).json({ message: "Password Update succesfuly" });
      }

      if (passwordUpdateError) {
        console.log("password Update Error");
        return res.status(500).json({ message: "Password doesnot update" });
      }
    }
    console.log(hashPasswordError);
    return res
      .status(500)
      .json({ message: "couldn't update password hash error" });
  };

  const updateProfilePassword = async function (req, res, userPasswordUpdate) {
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password doesnot match " });
    }

    const [hashPassword, hashPasswordError] = await wrapAwait(
      bcrypt.hash(newPassword, saltRound)
    );

    try {
      const response = await userPasswordUpdate(req.id, hashPassword);
      return res.status(200).json({ message: "Password Update " });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Unable to update password" });
    }
  };
  return {
    forgetPassword,
    passwordUpdate,
    updateProfilePassword,
  };
}

function authUtility(tokenExpireTime, saltRound, JWT_KEY, user_type) {
  //const tokenExpireTime = "1hr";

  const login = async function (req, res, user, path = "/") {
    if (req.loginType !== "google") {
      const { password } = req.body;

      if (!user) {
        console.log("No User Found");
        return res.status(401).send({ message: "Invalid Email or Password" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ message: "Invalid Email or Password" });
      }
    }
    console.log("This is user",user)

    const token = jwt.sign({ id: user.id,email: user.email, 
      name: user.name,user_type:user_type }, JWT_KEY, {
      expiresIn: tokenExpireTime,
    });

    let checkCookie = req.headers.cookie;
    if (req.cookies[`${user.id}`]) {
      console.log("THe cookies from inside");
      console.log(req.cookies[`${user.id}`]);
      req.cookies[`${user.id}`] = ""; // set null if already present
      res.clearCookie(`${user.id}`, { path: path }); // if already set on response
    }

    console.log("this is token ", token);

    res.cookie("id", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 1000 * 60),
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      message: "Successfully Logged In",
      name: user.name,
      email: user.email,
      user_id: user.id,
      role: user_type,
    });
  };

  const verifyToken = async function (req, res, next) {
    try {
      const token = req.cookies?.id || req?.header('Authorization')?.replace("Bearer",""); // header for mobile
      if (!token) {
          return res.status(401).json({ message: "Unauthorized request" });
      }
      console.log("this is token ", token);
  
      const decode = await jwt.verify(token, JWT_KEY);
      console.log("this is decode ", decode);
      
      // can find user form db and attach to req
      req.id = decode.id;
      req.user_type = user_type;
      console.log("this is decode ",decode)
      next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  };

  const refreshToken = async (req, res, next) => {
    const cookies = req.headers.cookie;
    let prevToken;
    if (typeof cookies === "string") {
      prevToken = cookies.split("=")[1]; //slipt headers from token
    }

    if (!prevToken) {
      return res.status(400).json({ message: "No Token found" });
    }

    jwt.verify(String(prevToken), JWT_KEY, (err, decode) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication Failed" });
      }

      //clear cookies from response
      res.clearCookie(`${decode.id}`);
      //clear cookies from headers
      req.cookies[`${decode.id}`] = "";

      //generate new token
      const newToken = jwt.sign({ id: decode.id }, JWT_KEY, {
        expiresIn: tokenExpireTime,
      });

      //set new Token to cookie
      res.cookie(String(decode.id), newToken, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 1000 * 60),
        httpOnly: true,
        sameSite: "None",
      });

      //set request id to user id
      req.id = decode.id;
      req.user_type = user_type;
      console.log("Refresh TOken Successfull  ");
      next();
    });
  };

  const logout = async (req, res) => {
    
    try {
      const token = req.cookies?.id || req.header('Authorization')?.replace("Bearer",""); // header for mobile
      if (!token) {
          return res.status(401).json({ message: "Unauthorized request" });
      }
      console.log("this is token ", token);
      console.log("I am here");
      const decode = await jwt.verify(token, JWT_KEY);
      console.log("I am also here")
      return res.status(200)
      .clearCookie('id')
      .json({ message: "Successfully Logout" });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Invalid Token" });
  }

    
  };

  return {
    login,
    verifyToken,
    refreshToken,
    logout,
  };
}

function utility() {
  const numberRegex = /(\+977)?[9][6-9]\d{8}/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleMulterError = async function (
    req,
    res,
    err,
    afterUploadCallback,
    isImageRequired = false
  ) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).json(err);
    } else if (err) {
      console.log(err);
      return res.status(400).json(err);
    }

    console.log("This is Single Image", req.file);
    console.log("This is double Image", req.files);
    //console.log(req?.files[0]?.path);

    if (isImageRequired) {
      if (
        !req?.file?.path &&
        !(req?.files?.length > 0 && req?.files[0]?.path)
      ) {
        return res.status(400).json({ message: "Please Upload Your Image" });
      }
    }

    afterUploadCallback();
  };

  const getSearchData = async function (req, res, getDataCB) {
    let page, limit, offSet;

    page = req.query.page || 1;

    limit = req.query.limit < 20 ? req.query.limit : 20 || 20;

    if (req.query.page) delete req.query.page;

    if (req.query.limit) delete req.query.limit;

    offSet = (page - 1) * limit;

    try {
      const data = await getDataCB(req.query, limit, offSet);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Error" });
    }
  };

  const isValid = {
    phoneNumber: async function (phoneNumber) {
      return phoneNumber?.match(numberRegex);
    },

    email: async function (email) {
      return email?.match(emailRegex);
    },

    password: async function (password, confirm_password) {
      return password === confirm_password;
    },
  };

  const getRandomNumber = function (minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
  };

  return {
    handleMulterError,
    isValid,
    getRandomNumber,
    getSearchData,
  };
}

function propertyUtility(property_type) {
  const validTypes = ["apartment", "house", "land"];
  if (!validTypes.includes(property_type)) {
    throw new Error(`Invalid Property type: ${type}`);
  }

  const propertyType = property_type;

  async function handleAddProperty(req, res, addPropertyCB) {
    let data = req.body?.property;
    let property = JSON.parse(data);
    console.log(property);
    let owner_id = null;
    let admin_id = null;
    let status;
    console.log(req.id, req.user_type);
    if (!req.id || !req.user_type) {
      return res.status(401).json({ message: "unauthorized" });
    }
    //property added by admin
    if (req.user_type === "staff" || req.user_type === "superAdmin") {
      admin_id = req.id;
      status = "approved";
    }
    // property added for listing
    if (req.user_type === "customer" || req.user_type === "agent") {
      owner_id = req.id;
      status = "pending";
    }

    let images;
    if (req.file) {
      images = req.file;
    } else if (req.files) {
      images = req.files;
    } else {
      images = null;
    }

    let imageArray;
    if (images) {
      imageArray = images.map((image) => {
        return image.path;
      });
    }

    if (!imageArray) {
      return res.status(400).json({ message: "Please Upload Image" });
    }


    console.log(images);
    console.log("this is image Array", imageArray);

    try {
      const value = await validateSchema[property_type](property);
      console.log("Validate schema", value);
      // update object - store some value
      let updatedProperty = {
        ...property,
        property_image: null,
        approved_by: admin_id,
        owner_id: owner_id,
        status: status,
      };
      console.log("")

      const response = await addPropertyCB(updatedProperty);
      uploadMultipleOnCloudinary(imageArray,property_type).then((data)=>{
        if(data){
          const property_id = response.dataValues.property_id;
          if(property_type === "apartment"){
            const apartmentUpdate = updateApartment(property_id,{property_image:data})
          }
          if(property_type === "house"){
            const houseUpdate = updateHouse(property_id,{property_image:data})
          }
          if(property_type === "land"){
            const landUpdate = updateLand(property_id,{property_image:data})
          }
        }
      })
      
      const notify = {
        user_id: req.id,
        user_type: req.user_type,
        notification: `New ${propertyType} Upload By ${req.user_type}`,
        //add url later
      };
      insertNotification(notify).catch((err) => {
        console.log(err);
        logger.error(`Error insert ${propertyType} notification - ${err}`);
      });

      return res.status(200).json({ message: `${propertyType} insert` });
    } catch (error) {
      // //delete from cloudinary
      // if(imageArray && !cloudinaryResponse){
      //   deleteFiles(imageArray)
      // }
      // if (cloudinaryResponse) {
      //   let linkArray = Object.values(cloudinaryResponse);

      //   deleteMultipleFromCloudinary(linkArray);
      // }

      return handleErrorResponse(res, error);
    }
  }


  async function handleUpdateProperty(req, res, updatePropertyCallback) {
    const updateProperty = JSON.parse(req.body.property);
    if (!updateProperty) {
      return res.status(400).json({ message: "Please Provide Update Data" });
    }
    const property_id = req.params.property_id;
    // property_type , property_id
    let cloudinaryResponse; 
    console.log("single image",req?.file);
    if(req?.file){
      cloudinaryResponse = await uploadOnCloudinary(req?.file?.path,property_type);
      if(cloudinaryResponse) {
        updateProperty.property_image = cloudinaryResponse.secure_url;
      }
    }
    if (updateProperty?.property_type) {
      delete updateProperty.property_type;
    }
    if (updateProperty?.property_id) {
      delete updateProperty.property_id;
    }
    console.log(updateProperty);
    try {
      const response = await updatePropertyCallback(
        property_id,
        updateProperty
      );
      console.log(response);
      console.log(Object.keys(response));
      console.log(response["0"]);
      console.log(typeof response);
      if (response["0"] === 0) {
        return res
          .status(404)
          .json({ message: `${propertyType} unable to update` });
      }
      return res.status(200).json({ message: `${propertyType} update` });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async function handleDeleteProperty(
    req,
    res,
    getPropertyCallback,
    deletePropertyCallabck
  ) {
    const property_id = req.params.property_id;

    try {
      const property = await getPropertyCallback(property_id);
      console.log("This is Property", property);
      console.log("This is property object", property?.property_image);
      console.log(
        "This is property object",
        property?.dataValues?.property_image
      );

      const response = await deletePropertyCallabck(property_id);
      if (response === 0) {
        return res.status(404).json({ message: `${propertyType} not found` });
      }
      let imagePathsObject = property?.dataValues?.property_image || null;
      console.log("this is project nres images ", imagePathsObject);
      logger.error("This is image path object", imagePathsObject);
      let imagePaths = imagePathsObject
        ? Object.values(imagePathsObject)
        : null;
      console.log("this is project nres images after parse ", imagePaths);
      if (imagePaths) {
       // deleteFiles(imagePaths);
        deleteMultipleFromCloudinary(imagePaths)
      }
      return res.status(200).json({ message: `${propertyType} deleted` });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async function handleDeletePropertyImage(req,res,deletePropertyImageCallback){
    const {property_id} = req.params;
    const {imageLink} = req.body;
    if(!imageLink){
      return res.status(400).json({message:"Please provide image link"})
    }
    console.log("This is image Link",imageLink)
    console.log("This is request body",req.body)

    try{
      const response = await deletePropertyImageCallback(property_id,imageLink);
      if(response === 0){
        return res.status(404).json({message:`${propertyType} not found`})
      }
      // delete image Link from cloudinary
      deleteFromCloudinary(imageLink).then((data)=>{
        console.log(data);
        console.log("Image Deleted",data);
      });

      return res.status(200).json({message:`${propertyType} image deleted`})
    }catch(error){
      handleErrorResponse(res,error);
    }

  }

  
  async function handleGetPropertyByID(
    req,
    res,
    getPropertyByIDCallback,
    updatePropertyViewsCB
  ) {
    const { property_id } = req.params;
    console.log(property_id);
    const { longitude, latitude } = req.body;

    try {
      const result = await getPropertyByIDCallback(property_id); // get single  apartment by property
      // if there is apartment then also update views
      console.log(result);

      if (!result) {
        return res.status(400).json({ message: `No ${propertyType}` });
      }

      updatePropertyViewsCB(property_id, latitude, longitude).catch((err) => {
        logger.error(`Error update ${propertyType} Views - ${err}`);
      });

      // // Destructure the propertyData object
      // const {
      //   houseViews: { views },
      //   ...rest
      // } = result?.dataValues;

      // // Combine into a single object
      // const combinedObject = {
      //   ...rest,
      //   views
      // };

      return res.status(200).json(result);
    } catch (error) {
      handleErrorResponse(res, error);
      //return res.status(500).json({ message: "Internal Error" });
    }
  }

  async function handleInsertPropertyComment(req, res, callbackProperty) {
    const { property_id } = req.params;
    let admin_id = req.id;

    let comment = req.body?.comment;
    let private = req.body?.private || false;

    if (!comment) {
      return res.status(400).json({ message: "Please Submit Your Comment" });
    }

    if (!admin_id) {
      return res
        .status(400)
        .json({ message: "You are not Authorize to Comment" });
    }

    try {
      const response = await callbackProperty(
        property_id,
        admin_id,
        comment,
        private
      );
      console.log(response);
      if (response.affectedRows === 0) {
        return response.status(500).json({ message: "No property to comment" });
      }
      return res.status(200).json({ message: "comment submit successfully" });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async function handleGetProperty(req, res, getPropertyCallBack) {
    const [limit, offSet] = handleLimitOffset(req.query);

    // if property request from customer or agent;
    let owner_id = null;
    if ((req.id && req.user_type === "customer") || req.user_type === "agent") {
      owner_id = req.id;
    }

    // get condition
    let condition = req.query ? req.query : {};
    let district = req.body?.district ? req.body.district : null;

    // district for location based search
    if (district) {
      condition.district = district;
    }

    if (condition?.minPrice || condition?.maxPrice) {
      condition.priceRange = {};
    }
    if (condition?.minPrice) {
      condition.priceRange.minPrice = minPrice;
      delete condition.minPrice;
    }
    if (condition?.maxPrice) {
      condition.priceRange.maxPrice = maxPrice;
      delete condition.maxPrice;
    }

    ///
    condition.limit = limit;
    condition.offset = offSet;

    console.log(condition);

    if (owner_id) {
      condition.owner_id = owner_id;
    }

    try {
      const data = await getPropertyCallBack(condition);
      console.log(data);
      //update views of property
      //await updateViewsCount()
      return res.status(200).json(data);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async function handleGetPropertyComment(req, res, getPropertyComment) {
    let { property_id } = req.params;

    //let admin_id = req.id;

    try {
      const data = await getPropertyComment(property_id);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable To Get Data" });
    }
  }

  async function handleInsertPropertyFeedback(
    req,
    res,
    insertPropertyFeedback
  ) {
    const customer_id = req.id; // from token verify

    const { property_id, feedback } = req.body;

    try {
      const result = await insertPropertyFeedback(
        property_id,
        customer_id,
        feedback
      );
      return res.status(200).json({ message: "Feedback Submit" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Error" });
    }
  }

  async function handleUpdatePropertyAds(req, res, updatePropertyAdsCallBack) {
    const { property_id } = req.params;
    const { ads_status } = req.body;

    try {
      const response = await updatePropertyAdsCallBack(ads_status, property_id);

      if (response.affectedRows === 0) {
        return res.status(400).json({ message: "No property to update " });
      }
      return res
        .status(200)
        .json({ message: "Successfully Update ads status" });
    } catch (error) {
      return res.status(500).json({ message: "unable to update" });
    }
  }

  return {
    handleAddProperty,
    handleUpdateProperty,
    handleDeleteProperty,
    handleDeletePropertyImage,
    handleGetPropertyByID,
    handleGetProperty,
    handleInsertPropertyComment,
    handleGetPropertyComment,
    handleInsertPropertyFeedback,
    handleUpdatePropertyAds,
  };
}

function handleErrorResponse(res, error) {
  console.log(error);

  const errorType = {
    SequelizeUniqueConstraintError: {
      //"email must be unique":{status:409,message:"Email Already Register"}
      status: 409,
      error: "UniqueConstraintError",
      message: `${error?.errors?.[0]?.message}`,
      logLevel: "info",
    },
    SequelizeForeignKeyConstraintError: {
      status: 400,
      error: "ForeignKeyConstraintError",
      message: "The provided foreign key does not match any existing record.",
      logLevel: "info",
    },
    SequelizeValidationError: {
      status: 400,
      error: "SequelizeValidationError",
      message: error?.message,
      logLevel: "info",
    },
    ValidationError: {
      status: 400,
      error: "ValidationError",
      message: `${error?.details?.[0]?.message}`,
      logLevel: "info",
    },
  };

  const validResponse = errorType[error?.name];

  if (validResponse) {
    // logger.error(`originalError:${error}, responseError: ${validResponse}`);
    logger.log({
      level: "error",
      message: validResponse.message,
    });
    return res.status(validResponse.status).json({
      error: validResponse.error,
      message: validResponse.message,
    });
  }

  const stringError = util.inspect(error);
  logger.log({
    level: "error",
    message: stringError,
  });

  return res.status(500).json({ message: `Internal Error ${error}` });
}

function handleLimitOffset(req) {
  let page, limit, offset;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query?.page || 1;

  limit = req.query?.limit < 20 ? req.query?.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query?.page) delete req.query.page;

  if (req.query?.limit) delete req.query.limit;

  offset = (page - 1) * limit;
  return [Number(limit), Number(offset)];
}

module.exports = {
  propertyUtility,
  utility,
  authUtility,
  userUtility,
  handleErrorResponse,
  handleLimitOffset,
};
