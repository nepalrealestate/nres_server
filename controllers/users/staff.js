
const bcrypt = require('bcrypt');
const {registerStaff,findStaff} = require("../../models/users/staff");
const {login} = require("./commonAuthCode");

const saltRound = 10;

const handleGetStaff = async function (req,res){
    console.log("Handling Staff");
    
    return res.status(200).json({message:"Getting Staff Data Soon!!"});
}

const handleStaffRegistration = async()=>{
    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        
        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await registerStaff(name,email,hashPassword);
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

const handleStaffLogin  = async()=>{

    const {email} = req.body;
  
    //find staff userName in DB

    const staff =  await findStaff(email);
    console.log(staff);

    //this login function handle all logic

    return login(req,res,staff);

}


module.exports={handleGetStaff,handleStaffRegistration,handleStaffLogin}