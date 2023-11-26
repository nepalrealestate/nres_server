const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  sendPasswordResetTokenMail,
} = require("../middlewares/middleware.sendEmail");
const { wrapAwait } = require("../errorHandling");


const { validateSchema } = require("./validationSchema");
const { deleteFiles } = require("../middlewares/middleware.uploadFile");
const logger = require("../utils/errorLogging/logger");


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
      const randomToken = Math.floor(Math.random() * (9999 - 1000) + 1000)
      const expireTime = Date.now() + 5 * 60 * 1000
  
      passwordToken.set(user.id, { token: randomToken, expireTime: expireTime });
      console.log(passwordToken)
  
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
      handleErrorResponse(res,error)
    }

   
  };

  const passwordUpdate = async function (req, res, user, updatePasswordCB) {
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const { email, token } = req.query;
    const user_id =user.id;

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
      console.log(storeToken)

      if (!storeToken) {
        return res.status(200).json({ message: "Please generate token again" });
      }
      if (storeToken.token !== Number(token)) {
        return res.status(400).json({ message: "No Token Match" });
      }

      // check expire date
      if (Date.now > storeToken.expireTime) {
        return res.status(400).json({ message: "Token Expire ! please generate New Token" });
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
          return res
            .status(200)
            .json({ message: "Password Update succesfuly" });
        }

        if (passwordUpdateError) {
          console.log("password Update Error");
          return res.status(500).json({ message: "Password doesnot update" });
        }
      }
      console.log(hashPasswordError)
      return res.status(500).json({ message: "couldn't update password hash error" });
    
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

function  authUtility(tokenExpireTime, saltRound, JWT_KEY, user_type) {
  //const tokenExpireTime = "1hr";

  const login = async function (req, res, user, path = "/") {
    const { password } = req.body;

    if (!user) {
      console.log("No User Found");
      return res.status(401).send({ message: "Invalid Email or Password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }
    
    const token = jwt.sign({ id: user.id }, JWT_KEY, {
      expiresIn: tokenExpireTime,
    });

    let checkCookie = req.headers.cookie;
    if (req.cookies[`${user.id}`]) {
      console.log("THe cookies from inside");
      console.log(req.cookies[`${user.id}`]);
      req.cookies[`${user.id}`] = ""; // set null if already present
      res.clearCookie(`${user.id}`, { path: path });// if already set on response
    }

    console.log('this is token ',token)

    res.cookie("id", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 1000 * 60),
      httpOnly: true,
      sameSite: "None",
      secure:true,
    });
   
    return res.status(200).json({ message: "Successfully Logged In", user_id: user.id, role: user_type });
  };

  const verifyToken = async function (req, res, next) {
    //in req.headers we get cookie in array
    const cookies = req.headers.cookie;
    //  console.log(req.headers)
    //  console.log(req.cookies)

    //const cookies = req.cookies;
    // console.log(cookies);
    console.log("THIS IS COOKIES", cookies);
    if (!cookies) {
      console.log("No cookies Bro !!!!!!!");
      return res.status(401).json({ message: "Unauthorized" });
    }
    let token;
    const cookieArray = cookies.split(';'); // Split into individual cookies
    // Loop through each cookie to find the token
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim().split('=');
      if (cookie[0] === 'id') {
        token = cookie[1];
        break;
      }
    }



    // const token = cookies.split("=")[1];
    // console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(String(token), JWT_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log(user.id);
      //set request id
      req.id = user?.id;
      req.user_type = user_type;
      console.log(req.id, req.user_type)
      console.log("Token Verify !!!");
      next();
    });
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
    res.clearCookie("id");
    return res.status(200).json({ message: "Successfully Logout" });
  }

   


  return {
    login,
    verifyToken,
    refreshToken,
    logout
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

    let property = JSON.parse(req.body.property);
    console.log(property)

    let owner_id = null;
    let admin_id = null;
    console.log(req.id, req.user_type)
    if (!req.id || !req.user_type) {
      return res.status(401).json({ message: "unauthorized" });
    }
    //property added by admin
    if (req.user_type === 'staff' || req.user_type === 'superAdmin') {
      admin_id = req.id;
    }
    // property added for listing
    if (req.user_type === 'customer' || req.user_type === 'agent') {
      owner_id = req.id;
    }


    let images;
    if (req.file) {
      images = req.file;
    } else if (req.files) {
      images = req.files;
    } else {
      images = null
    }

    let imageObject;
    if (images) {
      imageObject =
        images.reduce(
          (acc, value, index) => ({ ...acc, [index]: value.path }),
          {}
        );
    }
    // update object - store some value
    let updatedProperty = {
      ...property,
      property_image: imageObject,
      approved_by: admin_id,
      owner_id: owner_id
    };


    //console.log(property,imageObject)
    try {
      const value = await validateSchema[property_type](property);
      console.log("Validate schema", value);

      const response = await addPropertyCB(updatedProperty); // callback
      // data for notification
      // const data = {};
      // (data.notification = `New ${propertyType} Upload`),
      //   (data.url = `/pending${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)
      //     }/${response.get().property_id}`);

      // //pushNotification(data);

      return res.status(200).json({ message: `${propertyType} insert` });

    } catch (error) {
      //delete uploaded images
      if (images) {

        deleteFiles(images)

      }


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

    if (updateProperty?.property_type) {
      delete updateProperty.property_type;
    }
    if (updateProperty?.property_id) {
      delete updateProperty.property_id
    }
    console.log(updateProperty)
    try {
      const response = await updatePropertyCallback(property_id, updateProperty);
      console.log(response)
      console.log(Object.keys(response))
      console.log(response['0'])
      console.log(typeof response)
      if (response['0'] === 0) {
        return res.status(404).json({ message: `${propertyType} unable to update` })
      }
      return res.status(200).json({ message: `${propertyType} update` })
    } catch (error) {
      handleErrorResponse(res, error)
    }

  }

  async function handleDeleteProperty(req, res, getPropertyCallback, deletePropertyCallabck) {
    const property_id = req.params.property_id;

    try {
      const property = await getPropertyCallback(property_id);
      console.log("This is Property",property);
    

      const response = await deletePropertyCallabck(property_id);
      if (response === 0) {
        return res.status(404).json({ message: `${propertyType} not found` })
      }
      if (property?.property_image) {
        deleteFiles(property.property_image)
      }
      return res.status(200).json({ message: `${propertyType} deleted` })
    } catch (error) {

      handleErrorResponse(res, error);

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
    let latitude = 28.434883;
    let longitude = 85.72859;

    try {
      const result = await getPropertyByIDCallback(property_id); // get single  apartment by property
      // if there is apartment then also update views
      console.log(result)

      if (!result) {
        return res.status(400).json({ message: `No ${propertyType}` });
      }

      updatePropertyViewsCB(property_id, latitude, longitude).catch((err) => {
        logger.error(`Error update ${propertyType} Views - ${err}`);
      });

      
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
      console.log(response)
      if (response.affectedRows === 0) {
        return response.status(500).json({ message: "No property to comment" });
      }
      return res.status(200).json({ message: "comment submit successfully" });
    } catch (error) {
      handleErrorResponse(res, error)
    }
  }

  async function handleGetProperty(req, res, getPropertyCallBack) {

    const [limit,offSet] = handleLimitOffset(req.query)

    // if property request from customer or agent;
    let owner_id = null;
    if(req.id && req.user_type==='customer' || req.user_type==='agent'){
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

    if(owner_id){
      condition.owner_id = owner_id;
    }


    try {
      const data = await getPropertyCallBack(condition);
      console.log(data);
      //update views of property
      //await updateViewsCount()
      return res.status(200).json(data);
    } catch (error) {
      handleErrorResponse(res, error)

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
    handleGetPropertyByID,
    handleGetProperty,
    handleInsertPropertyComment,
    handleGetPropertyComment,
    handleInsertPropertyFeedback,
    handleUpdatePropertyAds,
  };
}



function handleErrorResponse(res, error) {
  
  const errorType = {
    "SequelizeUniqueConstraintError": {
      //"email must be unique":{status:409,message:"Email Already Register"}
      status: 409,
      error: "UniqueConstraintError",
      message: `${error?.errors?.[0]?.message}`,
      logLevel: 'info'
    },
    "SequelizeForeignKeyConstraintError": {
      status: 400,
      error: "ForeignKeyConstraintError",
      message: "The provided foreign key does not match any existing record.",
      logLevel: 'info'
    },
    "SequelizeValidationError": {
      status: 400,
      error: "SequelizeValidationError",
      message: error?.message,
      logLevel: 'info'
    },
    "ValidationError": {
      status: 400,
      error: "ValidationError",
      message: `${error?.details?.[0]?.message}`,
      logLevel: 'info'
    },

  }

  const validResponse = errorType[error?.name];


  if (validResponse) {
    // logger.error(`originalError:${error}, responseError: ${validResponse}`);
    logger.log({
      level: "error",
      message: validResponse.message
    })
    return res.status(validResponse.status).json
      ({
        error: validResponse.error,
        message: validResponse.message
      })
  }
 
  if (error) {
    logger.error(error);
    // Add more properties if needed
  } else {
    logger.error("Undefined error occurred");
  }
  console.log("error from handle",JSON.stringify(error))
  console.log("error from handle Normal Form",error)

  
  return res.status(500).json({ message: "Internal Error" })

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



module.exports = { propertyUtility, utility, authUtility, userUtility, handleErrorResponse, handleLimitOffset }
