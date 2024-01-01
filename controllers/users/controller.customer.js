const bcrypt = require("bcrypt");
require("dotenv").config();
const { wrapAwait } = require("../../errorHandling");
const utility = require("../controller.utils");
const {
  registerCustomer,
  findCustomer,
  getCustomer,
  getCustomerProfile,
  updateCustomerProfile,
} = require("../../models/services/users/service.customer");
const {
  getUser,
  findUserByID,
  getBuyer,
  getSeller,
  getSellerByID,
  findUserByEmail,
  updateCustomerPassword,
} = require("../../models/services/users/service.user");
const {
  countListingProperty,
} = require("../../models/services/property/service.property");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const {
  getSingleCustomerChat,
} = require("../../models/services/chat/service.customerChat");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../../utils/cloudinary");

const upload = new UploadImage(
  "uploads/users/customer/images",
  2 * 1024 * 1024
).upload.single("image");

const saltRound = 10;
const tokenExpireTime = "7d";
const JWT_KEY = process.env.JWT_KEY_CUSTOMER;
const auth = utility.authUtility(
  tokenExpireTime,
  saltRound,
  JWT_KEY,
  "customer"
);
const utils = utility.utility();
const user = utility.userUtility("customer");

const handleCustomerRegistration = async (req, res) => {
  const { name, email, phoneNumber, password, confirmPassword } = req.body;

  if (!name || !email || !phoneNumber || !password || !confirmPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const isEmailValid = utils.isValid.email(email);
  const isPhoneNumberValid = utils.isValid.phoneNumber(phoneNumber);
  const isPasswordValid = utils.isValid.password(password, confirmPassword);

  if (!isEmailValid || !isPhoneNumberValid || !isPasswordValid) {
    return res.status(400).json({ message: "invalid input" });
  }

  const [hashPassword, hashPasswordError] = await wrapAwait(
    bcrypt.hash(password, saltRound)
  );

  if (hashPasswordError) {
    console.log(hashPasswordError);

    return res
      .status(500)
      .json({
        error: "hash password error",
        message: "Internal Error !  please try ",
      });
  }
  const customer = {
    name: name,
    email: email,
    phone_number: phoneNumber,
    password: hashPassword,
  };

  const [response, responseError] = await wrapAwait(registerCustomer(customer));

  if (responseError) {
    // console.log(responseError);
    // if(responseError.name==='SequelizeUniqueConstraintError'){
    //     return res.status(400).json({message:"Customer Already Register"})
    // }
    // return res.status(500).json({message:"Internal Error"});
    return utility.handleErrorResponse(res, responseError);
  }
  return res.status(200).json({ message: "Customer Registration success" });
};

const handleCustomerLogin = async (req, res) => {
  const { email } = req.body;

  const [customer, customerError] = await wrapAwait(findCustomer(email));
  if (customerError) {
    console.log(customerError);
    return res.status(500).json({ message: "Internal Error" });
  }
  if (!customer && req.loginType === "google") {
    const { name, email } = req.body;
    const customer = {
      name: name,
      email: email,
      phone_number: null,
      password: null,
    };
    const [response, responseError] = await wrapAwait(
      registerCustomer(customer)
    );
    if (responseError) {
      utility.handleErrorResponse(res, responseError);
    }
    const [customerData, customerDataError] = await wrapAwait(
      findCustomer(email)
    );
    if (customerDataError) {
      console.log(customerError);
      utility.handleErrorResponse(res, customerDataError);
    }
    console.log("Customer Data", customerData);
    console.log(customerData);
    return auth.login(req, res, response.dataValues);
  }
  if (!customer) {
    return res.status(400).json({ message: "User not found" });
  }
  return auth.login(req, res, customer.dataValues);
};

const handleGetCustomerProfile = async (req, res) => {
  let customer_id = null;
  if (req.id && req.user_type === "customer") {
    customer_id = req.id;
  } else {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    const [customer, propertyCount] = await Promise.all([
      getCustomerProfile(customer_id),
      countListingProperty({ owner_id: customer_id }),
    ]);
    const response = {
      customer,
      propertyCount,
    };
    return res.status(200).json(response);
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleGetCustomerIsLoggedIn = async (req, res) => {
  let customer_id = req.id;
  if (!customer_id) {
    return res.status(400).json({ message: "Bad Request" });
  }
  try {
    const user = await getCustomerProfile(customer_id);
    return res
      .status(200)
      .json({
        ...user,
        message: "Customer Logged In",
        user_id: req.id,
        role: "customer",
      });
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleUpdateCustomerProfile = async (req, res) => {
  let customer_id = null;
  console.log("This is Update Profile");
  console.log(req.id);
  console.log(req.user_type)
  if (req.id && req.user_type === "customer") {
   
    customer_id = req.id;
  } else {
    console.log('reject from here')
    return res.status(400).json({ message: "Bad Request" });
  }

  upload(req, res, async function (err) {
    utils.handleMulterError(req, res, err, updateProfile, false);
  });

  async function updateProfile() {

    const updateData= JSON.parse(req.body?.updateData);
    
    const updateProfile = await updateCustomerProfile(customer_id,updateData);
    console.log("Update Profile",updateProfile)
    if(!updateProfile){
      return res.status(400).json({message:"Unable To Update Profile"})
    }

    if(req.file){
      const profile_image = req.file.path;
      uploadOnCloudinary(profile_image,"customer").then(async (result)=>{
        if(result){
          // get prevoius profile image
          const {profile_image:previousProfileImage} = await getCustomerProfile(customer_id);
          if(previousProfileImage){
            // delete previous profile image
            deleteFromCloudinary(previousProfileImage);
          }
          const updateImage = await updateCustomerProfile(customer_id,{profile_image});
          console.log("Update Imgae",updateImage)
        }
      })
      
      if(!updateImage){
        return res.status(400).json({message:"Unable To Update Profile Image"})
      }
    }

    return res.status(200).json({message:"Profile Updated Successfully"})



  }
};

const handleGetCustomer = async (req, res) => {
  let condition = {};
  condition.user_type = "customer";
  const [limit,offset] = utility.handleLimitOffset(req);

  if(req.query?.search){
    condition.search = req.query.search
  }
  try {
    const {rows:user,count:totalCount} = await getUser(condition,limit,offset);
    return res.status(200).json({user,totalCount});
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleGetCustomerByID = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const data = await findUserByID({
      user_type: "customer",
      user_id: customer_id,
    });
    return res.status(200).json(data);
  } catch (error) {
    utility.handleErrorResponse(error);
  }
};

// this function doesnot return any value
const handleGetBuyer = async (req, res) => {
  let condition = {};
  condition.user_type = "customer";
  const [limit,offset] = utility.handleLimitOffset(req);

  if(req.query?.search){
    condition.search = req.query.search
  }
  try {
    const {rows:user,count:totalCount} = await getBuyer(condition,limit,offset);
    return res.status(200).json({user,totalCount});
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleGetSeller = async (req, res) => {
  let condition = {};
  condition.user_type = "customer";
  const [limit,offset] = utility.handleLimitOffset(req);

  if(req.query?.search){
    condition.search = req.query.search
  }
  try {
    const {rows:user,count:totalCount} = await getSeller(condition,limit,offset);
    return res.status(200).json({user,totalCount});
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleGetSellerByID = async (req, res) => {
  const { seller_id } = req.params;
  console.log("This is For Single Seller");
  try {
    const data = await getSellerByID(seller_id);
    return res.status(200).json(data);
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleCustomerPasswordReset = async (req, res) => {
  const { email, token } = req.query;

  // if email field emptyempty
  if (!email) {
    return res.status(400).json({ message: "Please Enter Email" });
  }

  try {
    console.log("email", email, "token", token);
    const customerResponse = await findUserByEmail("customer", email);
    console.log(customerResponse);
    if (!customerResponse) {
      return res.status(400).json({ message: "No Customer Found" });
    }
    if (email && !token) {
      // if there is no token - then get token for reset password
      return await user.forgetPassword(req, res, customerResponse.dataValues);
    }
    if (email && token) {
      // pass update Password function as parameters;
      return await user.passwordUpdate(
        req,
        res,
        customerResponse.dataValues,
        updateCustomerPassword
      );
    }
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleGetPreviousChat = async (req, res) => {
  const [limit, offset] = utility.handleLimitOffset(req);
  const customer_id = req.id;
  try {
    const previousChat = await getSingleCustomerChat(
      customer_id,
      limit,
      offset
    );
  } catch (error) {}
};

const customerVerifyToken = async (req, res, next) => {
  auth.verifyToken(req, res, next);
};

const customerLogout = async (req, res) => {
  auth.logout(req, res);
};

module.exports = {
  handleCustomerRegistration,
  handleCustomerLogin,
  handleGetCustomer,
  handleUpdateCustomerProfile,
  customerVerifyToken,
  handleGetCustomerByID,
  handleGetBuyer,
  handleGetSeller,
  handleGetSellerByID,
  handleGetCustomerProfile,
  handleCustomerPasswordReset,
  handleGetCustomerIsLoggedIn,
  customerLogout,
  
};
