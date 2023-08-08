
const bcrypt = require("bcrypt")
require("dotenv").config();
const { wrapAwait } = require("../../errorHandling");
const  utility = require("../controller.utils");
const { registerCustomer, findCustomer, getCustomer } = require("../../models/services/users/service.customer");

const saltRound = 10;
const tokenExpireTime = "1hr";
const JWT_KEY = process.env.JWT_KEY_CUSTOMER
const auth = utility.authUtility(tokenExpireTime,saltRound,JWT_KEY,"customer")
const utils = utility.utility();


const handleCustomerRegistration = async (req,res)=>{
    const{name,email,phoneNumber,password,confirmPassword} = req.body;
    
    if(!name || !email || !phoneNumber ||!password || !confirmPassword){
        return res.status(400).json({message:"Missing fields"});
    }

    const isEmailValid = utils.isValid.email(email);
    const isPhoneNumberValid = utils.isValid.phoneNumber(phoneNumber);
    const isPasswordValid = utils.isValid.password(password,confirmPassword);

    if (!isEmailValid || !isPhoneNumberValid || !isPasswordValid){
        return res.status(400).json({message:"invalid input"})
    }

    const [hashPassword,hashPasswordError] = await wrapAwait(bcrypt.hash(password,saltRound))

    if(hashPasswordError){
        console.log(hashPasswordError);
        return res.status(500).json({message:"Internal Error !  please try "});
    }


    const [response,responseError]= await wrapAwait(registerCustomer({name,email,phoneNumber,hashPassword}));

    if(responseError){
        console.log(responseError);
        if(responseError.name==='SequelizeUniqueConstraintError'){
            return res.status(400).json({message:"Customer Already Register"})
        }
        return res.status(500).json({message:"Internal Error"});

    }
    return res.status(200).json({message:"Customer Registration success"})

}



const handleCustomerLogin = async (req,res)=>{
    const {email} = req.body;

    const [customer,customerError] = await wrapAwait(findCustomer(email));
    if(customerError){
        console.log(customerError);
        return res.status(500).json({message:"Internal Error"})
    }
    
    return auth.login(req,res,customer);
}

const handleGetCustomer = async (req,res)=>{
    const customer_id = req.id;
    if(!customer_id){
        return res.status(400).json({message:"You are not authorized"});
    }

    try {
        const data = await getCustomer(customer_id);
        console.log(data)
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message:"Internal Error"});
    }
}


const customerVerifyToken = async(req,res,next)=>{
    auth.verifyToken(req,res,next)
}



module.exports = {handleCustomerRegistration,handleCustomerLogin,handleGetCustomer,customerVerifyToken}