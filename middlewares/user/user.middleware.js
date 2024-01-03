const { generate } = require("generate-password");
const {
  findUserByEmail,
  registerUser,
} = require("../../models/services/users/service.user");
const { wrapAwait } = require("../../errorHandling");
const bcrypt = require("bcrypt");
const { sendPasswordEmail } = require("../middleware.sendEmail");
const { handleErrorResponse } = require("../../controllers/controller.utils");

const createCustomerIfNotExists = async (req, res, next) => {
  const { name, email, phone_number } = req.body;

  // if request from admin and have name email and phone number

  try {
    if(req.id && req.user_type == "admin" && name && email && phone_number){
      console.log("Email before send", email);
    let user = null;
      const findUser = await findUserByEmail("customer", email);
      if (findUser) {
        user = findUser?.dataValues;
      }
      if (!findUser) {
        //create user
        console.log("User Not Found", findUser);
  
        const password = generate({ length: 10, numbers: true });
  
        const [hashPassword, hashPasswordError] = await wrapAwait(
          bcrypt.hash(password, 10)
        );
  
        if (hashPasswordError) {
          handleErrorResponse(res, hashPasswordError); // Throw the error to the catch block
        }
  
        const customerData = {
          user_type: "customer",
          name: name,
          email: email,
          phone_number: phone_number,
          password: hashPassword,
        };
  
        console.log(customerData);
  
        const accountResponse = await registerUser(customerData);
        if (!accountResponse) {
          return res
            .status(400)
            .json({ message: "Error While Creating Account" });
        }
  
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
    }
    next();
  } catch (error) {
    handleErrorResponse(res, error);
  }

};

module.exports = {
  createCustomerIfNotExists,
};
