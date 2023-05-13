const bcrypt = require("bcrypt");
const {
  registerAgent,
  findAgent,
  updateAgentPassword,
} = require("../../models/users/model.agent");
const jwt = require("jsonwebtoken");
const {
  login,
  verifyToken,
  passwordReset,
  passwordUpdate,
} = require("./commonAuthCode");
const { getRandomNumber } = require("./controller.commonFunction");
const {
  deleteToken,
  findPasswordResetTokenValue,
} = require("../../models/users/model.commonUsersCode");
const { wrapAwait } = require("../../errorHandling");

const saltRound = 10;

const tokenExpireTime = "1hr";
const handleGetAgent = async (req, res) => {
  console.log("Get Agent Api Hit");

  return res.status(200).json({ message: "Successfully getting data....." });
};

const handleAgentRegistration = async (req, res) => {
  const {
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  } = req.body;

  //validate  password

  if (password !== confirmPassword) {
    console.log("Password not match  ");
    return res.status(403).json({ message: "Password  not match" });
  }
  try {
    const hashPassword = await bcrypt.hash(password, saltRound);
    //store details in DB
    const result = await registerAgent(name, email, hashPassword);
    if (result === undefined) {
      return res.status(403).json({ message: "Duplicate Email" });
    }
    console.log(result);

    return res.status(200).json({ message: "Registration Succesfull" });
  } catch (error) {
    //handle hashing error\
    console.log(error);

    return res.status(404).json({ message: error.sqlMessage });
  }
};

const handleAgentLogin = async (req, res) => {
  const { email } = req.body;

  //find buyer userName in DB

  const agent = await findAgent(email);
  console.log(agent);

  //this login function handle all logic

  return login(req, res, agent);
};

// Verify Token

const handleAgentVerifyToken = async (req, res, next) => {
  return verifyToken(req, res, next);
};

// Password Reset Function

const handleAgentPasswordReset = async (req, res, next) => {
  // recive email in parameter

  // if we recieve only email then reset password
  // if we recieve token email and password (in body)
  // after update password - delete token in database

  const { email, token } = req.query;

  // if email field empty
  if (!email) {
    return res.status(401).json({ message: "Please Enter Email" });
  }

  const [agent, agentError] = await wrapAwait(findAgent(email));
  if (email && token && agent) {
    async function updatePassword(id, hashPassword) {
      return await wrapAwait(updateAgentPassword(id, hashPassword));
    }
    // pass update Password function as parameters;
    return await passwordUpdate(req, res, agent, updatePassword);
  }
  // if there is no token - then get token for reset password
  return await passwordReset(req, res, agent);
};

module.exports = {
  handleAgentRegistration,
  handleGetAgent,
  handleAgentLogin,
  handleAgentVerifyToken,
  handleAgentPasswordReset,
};
