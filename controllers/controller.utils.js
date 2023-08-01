const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ModelUtility = require("../models/model.utils");
const {
  sendPasswordResetTokenMail,
} = require("../middlewares/middleware.sendEmail");
const { wrapAwait } = require("../errorHandling");
const { error } = require("winston");

const saltRound = 10;

const modelUtils = new ModelUtility();

function Utility() {
  //variables
  const numberRegex = /(\+977)?[9][6-9]\d{8}/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  this.handleMulterError = async function (
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
      console.log(err)
      return res.status(400).json(err);
    }

    console.log(req.file);
    console.log(req.files);
    //console.log(req?.files[0]?.path);

    if (isImageRequired) {
      if (!req?.file?.path && !req?.files[0]?.path) {
        return res.status(400).json({ message: "Please Upload Your Image" });
      }
    }

    afterUploadCallback();
  };

  this.handleRegistration = async function (res, insertCallback, values) {
    const [response, responseError] = await wrapAwait(insertCallback(values));

    if (responseError) {
      if (responseError.errno === 1062) {
        return res.status(409).json({ message: "Already Register" });
      }
      console.log(responseError);
      return res.status(500).json({ message: "Register Error" });
    }

    return res.status(200).json({ message: "Registration successfully" });
  };



  this.handleAddProperty = async function (req, res, addCallbackProperty) {
    // get user id from req.id i.e we set req.id when verify token
    let customer_id = null;
    let agent_id = null;
    // baseUrl provide us from where request coming from ex. /agent,/staff,/customer
    const user_type = req.baseUrl.substring(1);
    let property_type = req.path.substring(1);
    if(property_type==='addApartment'){
      property_type = 'apartmentProperty';
    }
    if(property_type==='addHouse'){
      property_type = 'houseProperty';
    }
    if(property_type==='addLand'){
      property_type = 'landProperty';
    }



    
    if (user_type === "customer") {
      customer_id = req.id;
    } else if (user_type === "agent") {
      agent_id = req.id;
    } else if (user_type ==="staff"){

    }else{
      return res.status(400).json({ message: "bad request" });
    }

    if (!req.body.property) {
      return res.status(400).json({ message: "missing property " });
    }





    // let { property, [property_type]: callbackProperty, location } = JSON.parse(
    //   req.body.property
    // );
    let property = JSON.parse(req.body.property);
    
    const images = req.files;

    const imageObject = JSON.stringify(
      images.reduce(
        (acc, value, index) => ({ ...acc, [index]: value.path }),
        {}
      )
    );

    console.log(imageObject)

    // update object - store some value
    property = {
      ...property,
      property_image: imageObject,
      property_video:null,
      approved_by:null,
      customer_id: customer_id,
      agent_id: agent_id,
    };




    try {
      //await insertApartmentProperty(property,apartmentProperty,user_id,user_type);

      await addCallbackProperty(
        property
      );

      return res.status(200).json({ message: "Insert into table" });
    } catch (error) {
      console.log("Why this error", error);
      return res.status(400).json({ message: error });
    }
  };


  this.handleInsertPropertyComment = async function (req,res,callbackProperty){
      const {property_id} = req.params;
  let staff_id;
  let super_admin_id;
  
  const user_type = req.baseUrl.substring(1);

  let comment = req.body.comment ;
  let private = req.body.private || false;


  if(!comment ){
    return res.status(400).json({message:"Please Submit Your Comment"});
  }

  if(user_type === 'staff'){
    staff_id = req.id;
    super_admin_id = null;
    private = false;
  }else if(user_type === 'superAdmin'){
    super_admin_id = req.id;
    if(req.body.private===true){
      private = true;
    }
    staff_id = null;
  }else{
    return res.status(400).json({message:"You are not Authorize to Comment"});
  }
 
  
  try {
    const response = await callbackProperty(property_id,staff_id,super_admin_id,comment,private);
    if(response.affectedRows===0){
      return response.status(500).json({message:"No property to comment"})
    }
    return res.status(200).json({message:"comment submit successfully"});
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Unable to submit comment"});
  }

  }





  this.getSearchData = async function (req, res, getDataFunction) {
    let page, limit, offSet;

    // if page and limit not set then defualt is 1 and 20 .
    page = req.query.page || 1;

    limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
    // if page and limit present in query then delete it
    if (req.query.page) delete req.query.page;

    if (req.query.limit) delete req.query.limit;

    offSet = (page - 1) * limit;

    try {
      const data = await getDataFunction(req.query, limit, offSet);
      console.log(data);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error.sqlMessage });
    }
  };

  
  this.handleGetPropertyComment = async function (req,res,getPropertyComment){

    let {property_id} = req.params;

    let super_admin_id = req.baseUrl.substring(1)==="superAdmin"?req.id:null;
    


    try {
      const data = await getPropertyComment(property_id,super_admin_id);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Unable To Get Data"});
    }


  }





  this.isValid = {
    phoneNumber: async function (phoneNumber) {
      return phoneNumber?.match(numberRegex);
    },

    email: async function (email) {
      return email?.match(emailRegex);
    },

    password: async function (password, confirm_password) {
      return password === confirm_password;
    },
  },
  this.getRandomNumber = function (minValue, maxValue) {
      return Math.floor(Math.random() * (maxValue - minValue) + minValue);
    };



}











function Auth() {
  const tokenExpireTime = "1hr";
  const saltRound = 10;

  (this.login = async function (req, res, user) {
    const { password } = req.body;
   
 
    if (!user) {
      console.log("No User Found");
      return res.status(404).send("User Not Found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password doesnot match" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: tokenExpireTime,
    });

    let checkCookie = req.headers.cookie;
    if (req.cookies[`${user.id}`]) {
      console.log("THe cookies from insdie");
      console.log(req.cookies[`${user.id}`]);
      req.cookies[`${user.id}`] = ""; // set null if already present
      //res.clearCookie(`${user.id}`,{path: "/"});// if already set on response
    }

    // //if there are two or more than different users login cookies then remove it from loop
    // not fully optimized solution
    if (checkCookie) {
      let cookieArray = req.headers.cookie.split(";");
      console.log(cookieArray);
      cookieArray.forEach((cookie) => {
        let key = cookie.trim().split("=")[0];
        if (req.cookies[`${key}`]) {
          //if user cookie already present then remove it
          console.log("This cookie already present", key);
          //req.cookies[`${key}`]="";
          res.clearCookie(`${key}`, { path: "/" });
          return;
        }
      });
    }

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 1000 * 60),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Successfully Logged In", token });
  }),
    (this.verifyToken = async function (req, res, next) {
      const cookies = req.headers.cookie;
      console.log(req.cookies);
      console.log("THIS IS COOKIES", req.headers.cookie);
      if (!cookies) {
        console.log("No cookies Bro !!!!!!!");
        return res.status(404).json({ message: "Cannot get information" });
      }

      const token = cookies.split("=")[1];
      console.log(token);
      if (!token) {
        return res.status(404).json({ message: "No Token found" });
      }
      jwt.verify(String(token), process.env.JWT_KEY, (err, user) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ message: "Invalid Token" });
        }

        console.log(user.id);
        //set request id
        req.id = user?.id;
        console.log("Token Verify  !!!");
        next();
      });
    }),
    (this.refreshToken = async (req, res, next) => {
      const cookies = req.headers.cookie;
      let prevToken;
      if (typeof cookies === "string") {
        prevToken = cookies.split("=")[1]; //slipt headers from token
      }

      if (!prevToken) {
        return res.status(400).json({ message: "No Token found" });
      }

      jwt.verify(String(prevToken), process.env.JWT_KEY, (err, decode) => {
        if (err) {
          console.log(err);
          return res.status(403).json({ message: "Authentication Failed" });
        }

        //clear cookies from response
        res.clearCookie(`${decode.id}`);
        //clear cookies from headers
        req.cookies[`${decode.id}`] = "";

        //generate new token
        const newToken = jwt.sign({ id: decode.id }, process.env.JWT_KEY, {
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
        console.log("Refresh TOken Successfull  ");
        next();
      });
    }),
    (this.passwordReset = async function (req, res, user) {
      if (!user) {
        return res.status(404).json({ message: "User Not Found!" });
      }

      const randomToken = getRandomNumber(1000, 9999);

      const [resultToken, errorToken] = await wrapAwait(
        modelUtils.insertPasswordResetToken(user.id, randomToken)
      );
      // if we get error of duplicate entry then update token value

      let isTokenUpdate = false;

      if (errorToken) {
        console.log(errorToken);
        if (errorToken.code === "ER_DUP_ENTRY") {
          // if duplicate entry the udpate token value
          const [resultUpdateToken, errorUpdateToken] = await wrapAwait(
            modelUtils.updatePasswordToken(user.id, randomToken)
          );
          if (errorUpdateToken) {
            return res.status(500).json({ message: error.sqlMessage });
          }
          isTokenUpdate = true;
          console.log(isTokenUpdate);
        } else {
          console.log(errorToken);
          return res.status(500).json({ message: "server Error " });
        }
      }
      // if token insert in db or updated in db then send mail
      if (resultToken || isTokenUpdate) {
        sendPasswordResetTokenMail(user.email, randomToken)
          .then(function (data) {
            console.log(data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      return res
        .status(200)
        .json({ message: "Token re-generate sucessfully Check Your Email " });
    });

  this.passwordUpdate = async function (req, res, user, updateUserPassword) {
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const { email, token } = req.query;

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

      const [storeToken, storeTokenError] = await wrapAwait(
        modelUtils.findPasswordResetToken(user.id)
      );

      console.log(storeToken);

      // check expire date

      const expireDate = new Date(storeToken.expirationTime);
      const currentDate = new Date();
      const expireDay = expireDate.getUTCDate();
      const currentDay = currentDate.getUTCDate();

      if (storeToken.token !== token || storeTokenError) {
        return res.status(401).json({ message: "No Token Match" });
      }

      //if token expire
      if (Number(currentDay) >= Number(expireDay)) {
        return res
          .status(401)
          .json({ message: "Token Expire ! please generate New Token" });
      }

      const [hashPassword, hashPasswordError] = await wrapAwait(
        bcrypt.hash(password, saltRound)
      );

      if (hashPassword) {
        // this updateUser password return result in array in form of resolve and reject
        const [passwordUpdate, passwordUpdateError] = await wrapAwait(
          updateUserPassword(user.id, hashPassword)
        );
        if (passwordUpdate) {
          modelUtils.deleteToken(user.id).then(function () {
            console.log("token delete Successfully");
          });
          return res
            .status(200)
            .json({ message: "Password Update succesfuly" });
        }

        if (passwordUpdateError) {
          console.log("password Update Error");
          return res.status(500).json({ message: "Password doesnot update" });
        }
      }

      return res.status(500).json({ message: "couldn't update password" });
    }
  };

  this.updateProfilePassword = async function (req, res, userPasswordUpdate) {
    const newPassword = req.body.new_password;
    const confirmPassword = req.body.confirm_password;

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
}

module.exports = { Utility, Auth };
