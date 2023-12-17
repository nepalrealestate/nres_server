const bcrypt = require("bcrypt");

const utility = require("../controller.utils");
const { wrapAwait } = require("../../errorHandling");
const {
  registerAdmin,
  findAdmin,
  updateSuperAdminPassword,
} = require("../../models/services/users/service.admin");

const saltRound = 10;
const tokenExpireTime = "1hr";
const JWT_KEY = process.env.JWT_KEY_AGENT;
const auth = utility.authUtility(
  tokenExpireTime,
  saltRound,
  JWT_KEY,
  "superAdmin"
);

const user = utility.userUtility("superAdmin");

const handleGetSuperAdmin = async (req, res) => {
  console.log("Get Super Admin Api Hit Hard!!");
  return res
    .status(200)
    .json({ message: "Very Soon Getting Super Admin Data Data" });
};

const handleSuperAdminRegistration = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  //validate  password
  console.log(password);
  console.log(confirmPassword);

  if (!name && !email && !password && !confirmPassword) {
    return res.status(400).json({ message: "missing fields" });
  }

  if (password !== confirmPassword) {
    console.log("Password not match  ");
    return res.status(403).json({ message: "Password  not match" });
  }
  try {
    const hashPassword = await bcrypt.hash(password, saltRound);
    //store details in DB
    const result = await registerAdmin("superAdmin", name, email, hashPassword);
    if (result === undefined) {
      return res.status(403).json({ message: "Duplicate Email" });
    }
    console.log(result);

    return res.status(200).json({ message: "Registration Succesfull" });
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleSuperAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "missing field" });
  }

  //find superAdmin userName in DB
  try {
    const superAdmin = await findAdmin(email, "superAdmin");
    console.log(superAdmin);
    return auth.login(req, res, superAdmin);
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleSuperAdminPasswordReset = async (req, res, next) => {
  // recive email in parameter

  // if we recieve only email then reset password
  // if we recieve token email and password (in body)
  // after update password - delete token

  const { email, token } = req.query;

  // if email field emptyempty
  if (!email) {
    return res.status(400).json({ message: "Please Enter Email" });
  }

  try {
    const adminResponse = await findAdmin(email, "superAdmin");
    console.log(adminResponse);
    if (!adminResponse) {
      return res.status(400).json({ message: "No Admin Found" });
    }
    if (email && !token) {
      // if there is no token - then get token for reset password
      return await user.forgetPassword(req, res, adminResponse);
    }
    if (email && token) {
      // pass update Password function as parameters;
      return await user.passwordUpdate(
        req,
        res,
        adminResponse,
        updateSuperAdminPassword
      );
    }
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const superAdminVerifyToken = async (req, res, next) => {
  auth.verifyToken(req, res, next);
};

const superAdminVerifyLogin = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Admin Logged In", user_id: req.id, role: "superAdmin" });
};

const superAdminLogout = async (req, res) => {
  auth.logout(req, res);
};

module.exports = {
  handleGetSuperAdmin,
  handleSuperAdminRegistration,
  handleSuperAdminLogin,
  handleSuperAdminPasswordReset,
  superAdminVerifyToken,
  superAdminVerifyLogin,
  superAdminLogout,
};
