const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  sendPasswordResetTokenMail,
} = require("../middlewares/middleware.sendEmail");
const { wrapAwait } = require("../errorHandling");

const { pushNotification } = require("./notification/controller.notification");
const { apartmentSchema, validateSchema } = require("./validationSchema");
const { deleteFiles } = require("../middlewares/middleware.uploadFile");
const logger = require("../utils/errorLogging/logger");


const saltRound = 10;


function userUtility(user_type) {
  const validTypes = ["staff", "superAdmin", "customer", "agent"];
  if (!validTypes.includes(user_type)) {
    throw new Error(`Invalid Property type: ${user_type}`);
  }

  const passwordToken = new Map();

  const passwordReset = async function (req, res, user) {
    const user_id = req.id;
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const randomToken = Math.floor(Math.random()*(9999-1000)+1000)
    const expireTime = Date.now() + 5 * 60 * 1000
   
    console.log(passwordToken)
    passwordToken.set(user_id, {token:randomToken,expireTime:expireTime});

    sendPasswordResetTokenMail(user.email, randomToken)
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    return res
      .status(200)
      .json({ message: "Token  sucessfully Check Your Email " });
  };

  const passwordUpdate = async function (req, res, user, updatePasswordCB) {
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const { email, token } = req.query;
    const user_id = req.id;

    // if email field empty
    if (!email) {
      return res.status(400).json({ message: "Please Enter Email" });
    }

    if (email && token && user) {
      // logic for update password
      const { password, confirmPassword } = req.body;
      // if password doesnot match
      if (password !== confirmPassword) {
        console.log(" New Password not match  ");
        return res.status(403).json({ message: " New Password  not match" });
      }

      

     const storeToken = passwordToken.get(user_id);
     console.log(storeToken)

     if(!storeToken){
      return res.status(200).json({message:"Please generate token again"});
     }
     if(storeToken.token !== Number(token)){
      return res.status(400).json({ message: "No Token Match" });
     }

      // check expire date
      if(Date.now>storeToken.expireTime){
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
    }
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
    passwordReset,
    passwordUpdate,
    updateProfilePassword,
  };
}

function authUtility(tokenExpireTime, saltRound, JWT_KEY, user_type) {
  //const tokenExpireTime = "1hr";

  const login = async function (req, res, user,path="/") {
    const { password } = req.body;

    if (!user) {
      console.log("No User Found");
      return res.status(401).send({message:"Invalid Email or Password"});
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({message:"Invalid Email or Password"});
    }

    const token = jwt.sign({ id: user.id }, JWT_KEY, {
      expiresIn: tokenExpireTime,
    });

    let checkCookie = req.headers.cookie;
    if (req.cookies[`${user.id}`]) {
      console.log("THe cookies from inside");
      console.log(req.cookies[`${user.id}`]);
      req.cookies[`${user.id}`] = ""; // set null if already present
      res.clearCookie(`${user.id}`,{path:path});// if already set on response
    }

    // //if there are two or more than different users login cookies then remove it from loop
    // not fully optimized solution
    // if (checkCookie) {
    //   let cookieArray = req.headers.cookie.split(";");
    //   console.log(cookieArray);
    //   cookieArray.forEach((cookie) => {
    //     let key = cookie.trim().split("=")[0];
    //     if (req.cookies[`${key}`]) {
    //       //if user cookie already present then remove it
    //       console.log("This cookie already present", key);
    //       //req.cookies[`${key}`]="";
    //       res.clearCookie(`${key}`, { path: path });
    //       return;
    //     }
    //   });
    // }
    console.log(String(user.id));
    console.log(token)

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 1000 * 60),
      httpOnly: true,
      sameSite: "lax",
    });
  
    return res.status(200).json({ message: "Successfully Logged In", token ,role:user_type});
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

    const token = cookies.split("=")[1];
    console.log(token);
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
      console.log(req.id,req.user_type)
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
        sameSite: "lax",
      });

      //set request id to user id
      req.id = decode.id;
      req.user_type = user_type;
      console.log("Refresh TOken Successfull  ");
      next();
    });
  };

  const logout = async (req,res)=>{

  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(401).json({ message: "You Are Not Authorized" });
  }
  const token = cookies.split("=")[1];
  if (!token) {
    return res.status(400).json({ message: "No Token" });
  }
  jwt.verify(token,JWT_KEY, (err, decode) => {
    if (err) {
      console.log(err)
      return res.status(403).json({ message: "Unable to Logout" });
    }
    res.clearCookie(`${decode.id}`);
    req.cookies[`${decode.id}`] = "";
    console.log("Logout Succesfully");
    return res.status(200).json({ message: "Successfully Logout" });
  });
  }

  //   const passwordReset = async function (req, res, user) {
  //     if (!user) {
  //       return res.status(404).json({ message: `${user_type} not found` });
  //     }

  //     const randomToken = getRandomNumber(1000, 9999);

  //     const [resultToken, errorToken] = await wrapAwait(
  //       modelUtils.insertPasswordResetToken(user.id, randomToken)
  //     );
  //     // if we get error of duplicate entry then update token value

  //     let isTokenUpdate = false;

  //     if (errorToken) {
  //       console.log(errorToken);
  //       if (errorToken.code === "ER_DUP_ENTRY") {
  //         // if duplicate entry the udpate token value
  //         const [resultUpdateToken, errorUpdateToken] = await wrapAwait(
  //           modelUtils.updatePasswordToken(user.id, randomToken)
  //         );
  //         if (errorUpdateToken) {
  //           return res.status(500).json({ message: error.sqlMessage });
  //         }
  //         isTokenUpdate = true;
  //         console.log(isTokenUpdate);
  //       } else {
  //         console.log(errorToken);
  //         return res.status(500).json({ message: "server Error " });
  //       }
  //     }
  //     // if token insert in db or updated in db then send mail
  //     if (resultToken || isTokenUpdate) {
  //       sendPasswordResetTokenMail(user.email, randomToken)
  //         .then(function (data) {
  //           console.log(data);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //     }

  //     return res
  //       .status(200)
  //       .json({ message: "Token re-generate sucessfully Check Your Email " });
  //   };

  //   const passwordUpdate = async function (req, res, user, updateUserPassword) {
  //   if (!user) {
  //     return res.status(404).json({ message: "User Not Found!" });
  //   }

  //   const { email, token } = req.query;

  //   // if email field empty
  //   if (!email) {
  //     return res.status(400).json({ message: "Please Enter Email" });
  //   }

  //   if (email && token && user) {
  //     // logic for update password
  //     const { password, confirmPassword } = req.body;
  //     // if password doesnot match
  //     if (password !== confirmPassword) {
  //       console.log(" New Password not match  ");
  //       return res.status(403).json({ message: " New Password  not match" });
  //     }

  //     const [storeToken, storeTokenError] = await wrapAwait(
  //       modelUtils.findPasswordResetToken(user.id)
  //     );

  //     console.log(storeToken);

  //     // check expire date

  //     const expireDate = new Date(storeToken.expirationTime);
  //     const currentDate = new Date();
  //     const expireDay = expireDate.getUTCDate();
  //     const currentDay = currentDate.getUTCDate();

  //     if (storeToken.token !== token || storeTokenError) {
  //       return res.status(401).json({ message: "No Token Match" });
  //     }

  //     //if token expire
  //     if (Number(currentDay) >= Number(expireDay)) {
  //       return res
  //         .status(401)
  //         .json({ message: "Token Expire ! please generate New Token" });
  //     }

  //     const [hashPassword, hashPasswordError] = await wrapAwait(
  //       bcrypt.hash(password, saltRound)
  //     );

  //     if (hashPassword) {
  //       // this updateUser password return result in array in form of resolve and reject
  //       const [passwordUpdate, passwordUpdateError] = await wrapAwait(
  //         updateUserPassword(user.id, hashPassword)
  //       );
  //       if (passwordUpdate) {
  //         modelUtils.deleteToken(user.id).then(function () {
  //           console.log("token delete Successfully");
  //         });
  //         return res
  //           .status(200)
  //           .json({ message: "Password Update succesfuly" });
  //       }

  //       if (passwordUpdateError) {
  //         console.log("password Update Error");
  //         return res.status(500).json({ message: "Password doesnot update" });
  //       }
  //     }

  //     return res.status(500).json({ message: "couldn't update password" });
  //   }
  // };

  // const updateProfilePassword = async function (req, res, userPasswordUpdate) {
  //   const newPassword = req.body.new_password;
  //   const confirmPassword = req.body.confirm_password;

  //   if (newPassword !== confirmPassword) {
  //     return res.status(400).json({ message: "Password doesnot match " });
  //   }

  //   const [hashPassword, hashPasswordError] = await wrapAwait(
  //     bcrypt.hash(newPassword, saltRound)
  //   );

  //   try {
  //     const response = await userPasswordUpdate(req.id, hashPassword);
  //     return res.status(200).json({ message: "Password Update " });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Unable to update password" });
  //   }
  // };

  return {
    login,
    verifyToken,
    refreshToken,
    logout,
    // passwordReset,
    // passwordUpdate,
    // updateProfilePassword,
    // updateProfilePassword,
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

    console.log("This is Single Image",req.file);
    console.log("This is double Image",req.files);
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

// function Utility() {
//   //variables
//   const numberRegex = /(\+977)?[9][6-9]\d{8}/;
//   const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

//   this.handleMulterError = async function (
//     req,
//     res,
//     err,
//     afterUploadCallback,
//     isImageRequired = false
//   ) {
//     if (err instanceof multer.MulterError) {
//       console.log(err);
//       return res.status(400).json(err);
//     } else if (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }

//     console.log(req.file);
//     console.log(req.files);
//     //console.log(req?.files[0]?.path);

//     if (isImageRequired) {
//       if (
//         !req?.file?.path &&
//         !(req?.files?.length > 0 && req?.files[0]?.path)
//       ) {
//         return res.status(400).json({ message: "Please Upload Your Image" });
//       }
//     }

//     afterUploadCallback();
//   };

//   this.handleAddProperty = async function (req, res, addCallbackProperty) {
//     // get user id from req.id i.e we set req.id when verify token
//     let customer_id = null;
//     let agent_id = null;
//     // baseUrl provide us from where request coming from ex. /agent,/staff,/customer
//     const user_type = req.baseUrl.substring(1);
//     let property_type = req.path.substring(1);
//     if (property_type === "addApartment") {
//       property_type = "apartmentProperty";
//     }
//     if (property_type === "addHouse") {
//       property_type = "houseProperty";
//     }
//     if (property_type === "addLand") {
//       property_type = "landProperty";
//     }

//     if (user_type === "customer") {
//       customer_id = req.id;
//     } else if (user_type === "agent") {
//       agent_id = req.id;
//     } else if (user_type === "staff") {
//     } else {
//       return res.status(400).json({ message: "bad request" });
//     }

//     if (!req.body.property) {
//       return res.status(400).json({ message: "missing property " });
//     }

//     // let { property, [property_type]: callbackProperty, location } = JSON.parse(
//     //   req.body.property
//     // );
//     let property = JSON.parse(req.body.property);

//     const images = req.files;

//     const imageObject = JSON.stringify(
//       images.reduce(
//         (acc, value, index) => ({ ...acc, [index]: value.path }),
//         {}
//       )
//     );

//     console.log(imageObject);

//     // update object - store some value
//     property = {
//       ...property,
//       property_image: imageObject,
//       property_video: null,
//       staff_id: null,
//       customer_id: customer_id,
//       agent_id: agent_id,
//     };

//     try {
//       //await insertApartmentProperty(property,apartmentProperty,user_id,user_type);

//       await addCallbackProperty(property);

//       return res.status(200).json({ message: "Insert into table" });
//     } catch (error) {
//       console.log("Why this error", error);
//       return res.status(400).json({ message: error });
//     }
//   };

//   this.handleInsertPropertyComment = async function (
//     req,
//     res,
//     callbackProperty
//   ) {
//     const { property_id } = req.params;
//     let staff_id;
//     let super_admin_id;

//     const user_type = req.baseUrl.substring(1);

//     let comment = req.body.comment;
//     let private = req.body.private || false;

//     if (!comment) {
//       return res.status(400).json({ message: "Please Submit Your Comment" });
//     }

//     if (user_type === "staff") {
//       staff_id = req.id;
//       super_admin_id = null;
//       private = false;
//     } else if (user_type === "superAdmin") {
//       super_admin_id = req.id;
//       if (req.body.private === true) {
//         private = true;
//       }
//       staff_id = null;
//     } else {
//       return res
//         .status(400)
//         .json({ message: "You are not Authorize to Comment" });
//     }

//     try {
//       const response = await callbackProperty(
//         property_id,
//         staff_id,
//         super_admin_id,
//         comment,
//         private
//       );
//       if (response.affectedRows === 0) {
//         return response.status(500).json({ message: "No property to comment" });
//       }
//       return res.status(200).json({ message: "comment submit successfully" });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Unable to submit comment" });
//     }
//   };

//   this.getSearchData = async function (req, res, getDataFunction) {
//     let page, limit, offSet;

//     // if page and limit not set then defualt is 1 and 20 .
//     page = req.query.page || 1;

//     limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
//     // if page and limit present in query then delete it
//     if (req.query.page) delete req.query.page;

//     if (req.query.limit) delete req.query.limit;

//     offSet = (page - 1) * limit;

//     try {
//       const data = await getDataFunction(req.query, limit, offSet);
//       console.log(data);
//       //update views of property
//       //await updateViewsCount()
//       return res.status(200).json(data);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: error.sqlMessage });
//     }
//   };

//   this.handleGetPropertyComment = async function (
//     req,
//     res,
//     getPropertyComment
//   ) {
//     let { property_id } = req.params;

//     let super_admin_id =
//       req.baseUrl.substring(1) === "superAdmin" ? req.id : null;

//     try {
//       const data = await getPropertyComment(property_id, super_admin_id);
//       return res.status(200).json(data);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Unable To Get Data" });
//     }
//   };

//   (this.isValid = {
//     phoneNumber: async function (phoneNumber) {
//       return phoneNumber?.match(numberRegex);
//     },

//     email: async function (email) {
//       return email?.match(emailRegex);
//     },

//     password: async function (password, confirm_password) {
//       return password === confirm_password;
//     },
//   }),
//     (this.getRandomNumber = function (minValue, maxValue) {
//       return Math.floor(Math.random() * (maxValue - minValue) + minValue);
//     });
// }

// function Auth() {
//   const tokenExpireTime = "1hr";
//   const saltRound = 10;

//   (this.login = async function (req, res, user) {
//     const { password } = req.body;

//     if (!user) {
//       console.log("No User Found");
//       return res.status(404).send("User Not Found");
//     }
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Password doesnot match" });
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
//       expiresIn: tokenExpireTime,
//     });

//     let checkCookie = req.headers.cookie;
//     if (req.cookies[`${user.id}`]) {
//       console.log("THe cookies from insdie");
//       console.log(req.cookies[`${user.id}`]);
//       req.cookies[`${user.id}`] = ""; // set null if already present
//       //res.clearCookie(`${user.id}`,{path: "/"});// if already set on response
//     }

//     // //if there are two or more than different users login cookies then remove it from loop
//     // not fully optimized solution
//     if (checkCookie) {
//       let cookieArray = req.headers.cookie.split(";");
//       console.log(cookieArray);
//       cookieArray.forEach((cookie) => {
//         let key = cookie.trim().split("=")[0];
//         if (req.cookies[`${key}`]) {
//           //if user cookie already present then remove it
//           console.log("This cookie already present", key);
//           //req.cookies[`${key}`]="";
//           res.clearCookie(`${key}`, { path: "/" });
//           return;
//         }
//       });
//     }

//     res.cookie(String(user.id), token, {
//       path: "/",
//       expires: new Date(Date.now() + 1000 * 1000 * 60),
//       httpOnly: true,
//       sameSite: "lax",
//     });

//     return res.status(200).json({ message: "Successfully Logged In", token });
//   }),
//     (this.verifyToken = async function (req, res, next) {
//       const cookies = req.headers.cookie;
//       console.log(req.cookies);
//       console.log("THIS IS COOKIES", req.headers.cookie);
//       if (!cookies) {
//         console.log("No cookies Bro !!!!!!!");
//         return res.status(404).json({ message: "Cannot get information" });
//       }

//       const token = cookies.split("=")[1];
//       console.log(token);
//       if (!token) {
//         return res.status(404).json({ message: "No Token found" });
//       }
//       jwt.verify(String(token), process.env.JWT_KEY, (err, user) => {
//         if (err) {
//           console.log(err);
//           return res.status(400).json({ message: "Invalid Token" });
//         }

//         console.log(user.id);
//         //set request id
//         req.id = user?.id;
//         console.log("Token Verify  !!!");
//         next();
//       });
//     }),
//     (this.refreshToken = async (req, res, next) => {
//       const cookies = req.headers.cookie;
//       let prevToken;
//       if (typeof cookies === "string") {
//         prevToken = cookies.split("=")[1]; //slipt headers from token
//       }

//       if (!prevToken) {
//         return res.status(400).json({ message: "No Token found" });
//       }

//       jwt.verify(String(prevToken), process.env.JWT_KEY, (err, decode) => {
//         if (err) {
//           console.log(err);
//           return res.status(403).json({ message: "Authentication Failed" });
//         }

//         //clear cookies from response
//         res.clearCookie(`${decode.id}`);
//         //clear cookies from headers
//         req.cookies[`${decode.id}`] = "";

//         //generate new token
//         const newToken = jwt.sign({ id: decode.id }, process.env.JWT_KEY, {
//           expiresIn: tokenExpireTime,
//         });

//         //set new Token to cookie
//         res.cookie(String(decode.id), newToken, {
//           path: "/",
//           expires: new Date(Date.now() + 1000 * 1000 * 60),
//           httpOnly: true,
//           sameSite: "lax",
//         });

//         //set request id to user id
//         req.id = decode.id;
//         console.log("Refresh TOken Successfull  ");
//         next();
//       });
//     }),
//     (this.passwordReset = async function (req, res, user) {
//       if (!user) {
//         return res.status(404).json({ message: "User Not Found!" });
//       }

//       const randomToken = getRandomNumber(1000, 9999);

//       const [resultToken, errorToken] = await wrapAwait(
//         modelUtils.insertPasswordResetToken(user.id, randomToken)
//       );
//       // if we get error of duplicate entry then update token value

//       let isTokenUpdate = false;

//       if (errorToken) {
//         console.log(errorToken);
//         if (errorToken.code === "ER_DUP_ENTRY") {
//           // if duplicate entry the udpate token value
//           const [resultUpdateToken, errorUpdateToken] = await wrapAwait(
//             modelUtils.updatePasswordToken(user.id, randomToken)
//           );
//           if (errorUpdateToken) {
//             return res.status(500).json({ message: error.sqlMessage });
//           }
//           isTokenUpdate = true;
//           console.log(isTokenUpdate);
//         } else {
//           console.log(errorToken);
//           return res.status(500).json({ message: "server Error " });
//         }
//       }
//       // if token insert in db or updated in db then send mail
//       if (resultToken || isTokenUpdate) {
//         sendPasswordResetTokenMail(user.email, randomToken)
//           .then(function (data) {
//             console.log(data);
//           })
//           .catch(function (error) {
//             console.log(error);
//           });
//       }

//       return res
//         .status(200)
//         .json({ message: "Token re-generate sucessfully Check Your Email " });
//     });

//   this.passwordUpdate = async function (req, res, user, updateUserPassword) {
//     if (!user) {
//       return res.status(404).json({ message: "User Not Found!" });
//     }

//     const { email, token } = req.query;

//     // if email field empty
//     if (!email) {
//       return res.status(400).json({ message: "Please Enter Email" });
//     }

//     if (email && token && user) {
//       // logic for update password
//       const { password, confirmPassword } = req.body;
//       // if password doesnot match
//       if (password !== confirmPassword) {
//         console.log(" New Password not match  ");
//         return res.status(403).json({ message: " New Password  not match" });
//       }

//       const [storeToken, storeTokenError] = await wrapAwait(
//         modelUtils.findPasswordResetToken(user.id)
//       );

//       console.log(storeToken);

//       // check expire date

//       const expireDate = new Date(storeToken.expirationTime);
//       const currentDate = new Date();
//       const expireDay = expireDate.getUTCDate();
//       const currentDay = currentDate.getUTCDate();

//       if (storeToken.token !== token || storeTokenError) {
//         return res.status(401).json({ message: "No Token Match" });
//       }

//       //if token expire
//       if (Number(currentDay) >= Number(expireDay)) {
//         return res
//           .status(401)
//           .json({ message: "Token Expire ! please generate New Token" });
//       }

//       const [hashPassword, hashPasswordError] = await wrapAwait(
//         bcrypt.hash(password, saltRound)
//       );

//       if (hashPassword) {
//         // this updateUser password return result in array in form of resolve and reject
//         const [passwordUpdate, passwordUpdateError] = await wrapAwait(
//           updateUserPassword(user.id, hashPassword)
//         );
//         if (passwordUpdate) {
//           modelUtils.deleteToken(user.id).then(function () {
//             console.log("token delete Successfully");
//           });
//           return res
//             .status(200)
//             .json({ message: "Password Update succesfuly" });
//         }

//         if (passwordUpdateError) {
//           console.log("password Update Error");
//           return res.status(500).json({ message: "Password doesnot update" });
//         }
//       }

//       return res.status(500).json({ message: "couldn't update password" });
//     }
//   };

//   this.updateProfilePassword = async function (req, res, userPasswordUpdate) {
//     const newPassword = req.body.new_password;
//     const confirmPassword = req.body.confirm_password;

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "Password doesnot match " });
//     }

//     const [hashPassword, hashPasswordError] = await wrapAwait(
//       bcrypt.hash(newPassword, saltRound)
//     );

//     try {
//       const response = await userPasswordUpdate(req.id, hashPassword);
//       return res.status(200).json({ message: "Password Update " });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Unable to update password" });
//     }
//   };
// }

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

    if(!req.id || !req.user_type){
      return res.status(401).json({message:"unauthorized"});
    }
    //property added by admin
    if(req.user_type === 'staff' || req.user_type==='superAdmin'){
      admin_id = req.id;
    }
    // property added for listing
    if(req.user_type === 'customer' || req.user_type === 'agent'){
      owner_id = req.id;
    }

  
    let images;
    if(req.file){
      images = req.file;
    }else if(req.files){
      images = req.files;
    }else{
      images = null
    }

    let imageObject;
    if(images){
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
      owner_id : owner_id
    };


    //console.log(property,imageObject)
    try {
      const value = await validateSchema[property_type](property);
      console.log("Validate schema",value);
    
      const response = await addPropertyCB(updatedProperty); // callback
      // data for notification
      const data = {};
      (data.notification = `New ${propertyType} Upload`),
        (data.url = `/pending${
          propertyType.charAt(0).toUpperCase() + propertyType.slice(1)
        }/${response.get().property_id}`);

      pushNotification(data);

      return res.status(200).json({ message: `${propertyType} insert` });

    } catch (error) {
      //delete uploaded images
      if(images){
        
        deleteFiles(images)
        
      }

    
      return handleErrorResponse(res,error);

    }
  }

   async function handleUpdateProperty (req,res,updatePropertyCallback){

    const updateProperty = req.body
    if(!updateProperty){
      return res.status(400).json({message:"Please Provide Update Data"});
    }
  
    const property_id = req.params.property_id;
    // property_type , property_id 

    if(updateProperty?.property_type){
      delete updateProperty.property_type;
    }
    if(updateProperty?.property_id){
      delete updateProperty.property_id
    }
    console.log(updateProperty)
    try {
      const response = await updatePropertyCallback(property_id,updateProperty);
      console.log(response)
      console.log(Object.keys(response))
      console.log(response['0'])
      console.log(typeof response)
      if(response['0']===0){
        return res.status(404).json({message:`${propertyType} unable to update`})
      }
      return res.status(200).json({message:`${propertyType} update`})
    } catch (error) {
      handleErrorResponse(res,error)
    }

  }

  async function handleDeleteProperty(req,res,deletePropertyCallabck){
    const property_id = req.params.property_id;

    try {
      const response = await deletePropertyCallabck(property_id);
      if(response===0){
        return res.status(404).json({message:`${propertyType} not found`})
      }
      return res.status(200).json({message:`${propertyType} deleted`})
    } catch (error) {

      handleErrorResponse(res,error);
      
    }
  }

  async function handleGetPropertyByID(
    req,
    res,
    getPropertyById,
    updatePropertyViewsCB
  ) {
    const { property_id } = req.params;
    console.log(property_id);
    let latitude = 28.434883;
    let longitude = 85.72859;

   

    try {
      const result = await getPropertyById(property_id); // get single  apartment by property
      // if there is apartment then also update views
      
      if (!result) {
        return res.status(400).json({ message: `No ${propertyType}` });
      }

      updatePropertyViewsCB(property_id,latitude,longitude).catch((err)=>{
        logger.error(`Error update ${propertyType} Views - ${err}`);
      });

      // update views
      // const [updateViews, updateViewsError] = await wrapAwait(
      //   updatePropertyViews(property_id, latitude, longitude)
      // );
      // if (updateViewsError) {
      //   return res.status(500).json({ message: "Error while getting Data" });
      // }

      return res.status(200).json(result);
    } catch (error) {
      
      handleErrorResponse(res,error);
      //return res.status(500).json({ message: "Internal Error" });
    }
  }

  async function handleInsertPropertyComment(req, res, callbackProperty) {
    const { property_id } = req.params;
    let staff_id;
    let super_admin_id;

    const user_type = req.baseUrl.substring(1);

    let comment = req.body.comment;
    let private = req.body.private || false;

    if (!comment) {
      return res.status(400).json({ message: "Please Submit Your Comment" });
    }

    if (user_type === "staff") {
      staff_id = req.id;
      super_admin_id = null;
      private = false;
    } else if (user_type === "superAdmin") {
      super_admin_id = req.id;
      if (req.body.private === true) {
        private = true;
      }
      staff_id = null;
    } else {
      return res
        .status(400)
        .json({ message: "You are not Authorize to Comment" });
    }

    try {
      const response = await callbackProperty(
        property_id,
        staff_id,
        super_admin_id,
        comment,
        private
      );
      if (response.affectedRows === 0) {
        return response.status(500).json({ message: "No property to comment" });
      }
      return res.status(200).json({ message: "comment submit successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Unable to submit comment" });
    }
  }

  async function handleGetProperty(req, res, getPropertyCallBack) {
    
    let page, limit, offSet;

  // if page and limit not set then defualt is 1 and 20 .
  page = req.query.page || 1;

  limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
  // if page and limit present in query then delete it
  if (req.query.page) delete req.query.page;

  if (req.query.limit) delete req.query.limit;

  offSet = (page - 1) * limit;

  // get condition
  let  condition = req.query?req.query:{};
  let district  = req.body?.district?req.body.district:null;



  // district for location based search
  if(district){
    condition.district = district;
  }

  

  if(condition?.minPrice || condition?.maxPrice){
    condition.priceRange = {};
  }
  if(condition?.minPrice){
    condition.priceRange.minPrice = minPrice;
    delete condition.minPrice;
  }
  if(condition?.maxPrice){
    condition.priceRange.maxPrice = maxPrice;
    delete condition.maxPrice;
  }



  ///
  condition.limit = limit;
  condition.offset = offSet;

  console.log(condition);
  

    try {
      const data = await getPropertyCallBack(condition);
      console.log(data);
      //update views of property
      //await updateViewsCount()
      return res.status(200).json(data);
    } catch (error) {
      handleErrorResponse(res,error)
     
    }
  }

  async function handleGetPropertyComment(req, res, getPropertyComment) {
    let { property_id } = req.params;

    let super_admin_id =
      req.baseUrl.substring(1) === "superAdmin" ? req.id : null;

    try {
      const data = await getPropertyComment(property_id, super_admin_id);
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

  async function handleUpdatePropertyAds(req, res, updatePropertyAds) {
    const { property_id } = req.params;
    const { ads_status } = req.body;

    try {
      const response = await updatePropertyAds(ads_status, property_id);

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
  };
}


function handleErrorResponse(res,error){
  //log error
  // logger.error(error)
  
  console.log(error)


  const errorType  = {
      "SequelizeUniqueConstraintError":{
        //"email must be unique":{status:409,message:"Email Already Register"}
        status:409,
        error:"UniqueConstraintError",
        message:`${error?.errors?.[0]?.message}`,
        logLevel:'info'
      },
      "SequelizeForeignKeyConstraintError":{
        status:400,
        error:"ForeignKeyConstraintError",
        message:"The provided foreign key does not match any existing record.",
        logLevel:'info'
      },
      "SequelizeValidationError":{
        status:400,
        error:"SequelizeValidationError",
        message:error?.message,
        logLevel:'info'
      },
      "ValidationError":{
        status:400,
        error:"ValidationError",
        message:`${error?.details?.[0]?.message}`,
        logLevel:'info'
      },
      
  }
  
  const validResponse = errorType[error?.name];

  console.log(validResponse)

  if(validResponse){
    // logger.error(`originalError:${error}, responseError: ${validResponse}`);
    logger.log({
      level:validResponse.logLevel,
      message:validResponse.message
    })
    return res.status(validResponse.status).json
    ({
      error:validResponse.error,
      message:validResponse.message
    })
  }
  // logger.error(`originalError:${error}, responseError: ${validResponse}`);
  logger.error(error);
  return res.status(500).json({message:"Internal Error"})

}




module.exports = { propertyUtility, utility, authUtility, userUtility,handleErrorResponse };
