
const bcrypt = require('bcrypt');
const {registerStaff,findStaff} = require("../../models/users/staff");
const {login} = require("./commonAuthCode");
const { insertVideoLink } = require('../../models/property/model.property');

const saltRound = 10;

const handleGetStaff = async function (req,res){
    console.log("Handling Staff");
    
    return res.status(200).json({message:"Getting Staff Data Soon!!"});
}

const handleStaffRegistration = async(req,res)=>{

    if(req.body.googleTokenAccess){

        

    }else{
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


   
}

const handleStaffLogin  = async(req,res)=>{

    const {email} = req.body;
  
    //find staff userName in DB

    const staff =  await findStaff(email);
    console.log(staff);

    //this login function handle all logic

    return login(req,res,staff);

}


const handleAddVideoLink = async (req,res)=>{
    const {property_type,videoLink} = req.body;

    

    

    if(!property_type || ! videoLink){
        return res.status(400).json({message:"Input field cannot be empty"});
    }

    const link = videoLink.split("=");
    const video_ID = link[1];
    try {
         await insertVideoLink(video_ID,property_type,videoLink);
         console.log("Video Upload succesfully")
        return res.status(200).json({message:"video link upload sucessfull"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.sqlMessage});
    }
}


module.exports={handleGetStaff,handleStaffRegistration,handleStaffLogin,handleAddVideoLink}