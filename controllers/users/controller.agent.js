const bcrypt = require("bcrypt");
const {
  registerAgent,
  findAgent,
 updateAgentPassword
} = require("../../models/users/model.agent");
const jwt = require("jsonwebtoken");
const { login, verifyToken, passwordReset } = require("./commonAuthCode");
const { getRandomNumber } = require("./controller.commonFunction");

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
  const { email, token } = req.query;
  const agent = await findAgent(email);
  if (token) {
    console.log("Update password comming soon !!!!");
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      console.log("Password not match  ");
      return res.status(403).json({ message: "Password  not match" });
    }

    try {
      const hashPassword = await bcrypt.hash(password, saltRound);
      await updateAgentPassword(agent.id,hashPassword);
      return res.status(200).json({message:"Password Update succesfuly"});
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Password doesnot update"});


    }

    return res
      .status(200)
      .json({ message: "Update password function work soon!!!" });
  }
  return await passwordReset(req, res, agent);
};

module.exports = {
  handleAgentRegistration,
  handleGetAgent,
  handleAgentLogin,
  handleAgentVerifyToken,
  handleAgentPasswordReset,
};
