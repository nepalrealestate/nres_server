const bcrypt = require('bcrypt');
const {connection}  = require('../../connection');
const {createBuyer,findBuyer, insertIntofavProperty} = require("../../models/users/model.buyer")
const jwt = require("jsonwebtoken");
const {login} = require('./commonAuthCode');
const { wrapAwait } = require('../../errorHandling');

const saltRound  = 10;

const tokenExpireTime = '1hr';



const handleBuyerRegistration = async function(req,res){
    
    
    
    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

    if(!name || !email || !password ){
        return res.status(400).json({message:"Email or Password is missing "})
    }

    if (password !== confirmPassword ) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    // try {

        
    //     const hashPassword  = await bcrypt.hash(password,saltRound);
    //     //store details in DB
    //     const result = await createBuyer(name,email,hashPassword);
    //     if(result===undefined){
    //         return res.status(403).json({message:"Duplicate Email"});
    //     }
    //     console.log(result);


     



    //     return res.status(200).json({message:"Registration Succesfull"});
    // } catch (error) {
    //     //handle hashing error\
    //     console.log(error);
       
    //     return res.status(404).json({message:"Email Already Register"});
    // }



    const [hashPassword,hashPasswordError]= await wrapAwait(bcrypt.hash(password,saltRound));
    if(hashPassword){

        const [response,responseError] = await wrapAwait(createBuyer(name,email,hashPassword));
        if(responseError){
            return res.status(400).json({message:responseError})
        }
        return res.status(200).json({message:"Buyer Register Successfully"});
        

    }else{
        return res.status(500).json({message:"Internal Server error"})
    }
   



}


const handleBuyerLogin = async function (req,res){

    const {email} = req.body;
  
    //find buyer userName in DB

    const buyer =  await findBuyer(email);
    console.log(buyer);

    //this login function handle all logic

    return login(req,res,buyer);

}



async function handleBuyers (req,res){

    console.log(req.body);
    console.log("Buyer Api Hitt!!!!")

    return res.status(200)
}


const handleBuyerFavouriteProperty = async (req,res)=>{

    const {buyer_ID,property_ID} = req.body;

    if(!buyer_ID || !property_ID){
        return res.status(400).json({message:"buyer id or property id is missing"});
    }

    try {
        await insertIntofavProperty(buyer_ID,property_ID);
        return res.status(200).json({message:"favourite property added"});
    } catch (error) {
        return res.status(400).json({message:error});
        
    }

}





module.exports ={handleBuyers,handleBuyerRegistration,handleBuyerLogin,handleBuyerFavouriteProperty}