const bcrypt = require('bcrypt');
const {registerRental,findRental} = require("../../models/users/rental");
const {login} = require("./commonAuthCode");

const saltRound = 10;

const handleRentalRegistration = async(req,res)=>{

    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        
        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await registerRental(name,email,hashPassword);
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


const handleRentalLogin = async(req,res)=>{


    const {email} = req.body;
  
    //find rental userName in DB

    const rental =  await findRental(email);
    console.log(rental);

    //this login function handle all logic

    return login(req,res,rental);


}


const handleGetRental = async(req,res)=>{
    console.log("Get Rental Api Hit Hard!!")
    return res.status(200).json({message:"Very Soon Getting Rental Data"});
}


module.exports = {handleRentalRegistration,handleGetRental,handleRentalLogin};



