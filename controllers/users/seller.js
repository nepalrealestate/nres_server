
const bcrypt = require("bcrypt");
const {login } = require('./commonAuthCode');
const { registerSeller, findSeller } = require("../../models/users/seller");

const saltRound = 10;

const handleGetSeller = async(req,res)=>{

   console.log("Seller API HIT");
   return res.status(200).json({message:"Getting Seller Soon !!!"})


}

const handleSellerRegistration = async (req,res)=>{


    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        
        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await registerSeller(name,email,hashPassword);
        if(result===undefined){
            return res.status(403).json({message:"Duplicate Email"});
        }
        console.log(result);


     



        return res.status(200).json({message:"Registration Succesfull"});
    } catch (error) {
        //handle hashing error\
        console.log(error);
       
        return res.status(404).json({message:"Email Already Register"});
    }
}

const handleSellerLogin = async (req,res)=>{

    const {email} = req.body;
  
    //find seller userName in DB

    const rental =  await findSeller(email);
    console.log(rental);

    //this login function handle all logic

    return login(req,res,rental);
}

module.exports = {handleGetSeller,handleSellerRegistration,handleSellerLogin}