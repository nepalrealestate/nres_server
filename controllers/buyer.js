const bcrypt = require('bcrypt');
const {connection}  = require('../connection');
const {createBuyer,findBuyer} = require('../models/buyer')
const jwt = require("jsonwebtoken");

const saltRound  = 10;

const tokenExpireTime = '1hr';



const handleRegistration = async function(req,res){
    console.log("Buyers Registration Successfulllll");
    
    
    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        
        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await createBuyer(name,email,hashPassword);
        if(result===undefined){
            return res.status(403).json({message:"Duplicate Email"});
        }
        console.log(result);


     



        return res.status(200).json({message:"Registration Succesfull"});
    } catch (error) {
        //handle hashing error\
        console.log(error);
        return res.status(404).json({message:"Error Occurr"});
    }
   



}


const handleLogin = async function (req,res){

    const {email,password} = req.body;
    // console.log(userName,password);
    console.log(req.body)
   
    console.log("Geeting the data")

    //find buyer userName in DB

    const buyer =  await findBuyer(email);
    console.log(buyer);
    
    if (!buyer) {
        console.log("No User Found");
        return res.status(404).send("User Not Found");
      }

    //compare bcrypt password;

    const match = await bcrypt.compare(password,buyer.password);

    if(!match){
        return res.status(401).json({message:"Password doesnot match"});
    }


    //create jwt token

     
  const token = jwt.sign({ id: buyer.email }, process.env.JWT_KEY, {
    expiresIn: tokenExpireTime,
  });
 // if cookie already present then remove;
  let checkCookie = req.headers.cookie;
  console.log("Checking Cookie.......", checkCookie);
  if (req.cookies[`${buyer.email}`]) {
    req.cookies[`${buyer.email}`] = "";
  }
   
     //set cookies to response
  res.cookie(String(buyer.email), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 1000 * 60),
    httpOnly: true,
    sameSite: "lax",
  });
    //return success message
    return res.status(200).json({ message: "Successfully Logged In", token });

}



async function handleBuyers (req,res){

    console.log(req.body);
    console.log("Buyer Api Hitt!!!!")

    return res.status(200)
}





module.exports ={handleBuyers,handleRegistration,handleLogin}