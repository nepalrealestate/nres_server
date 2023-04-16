const bcrypt = require('bcrypt');


const saltRound  = 10;





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
        return res.status(200).json({message:"Registration Succesfull"});
    } catch (error) {
        //handle hashing error
    }
   



}


const handleLogin = async function (req,res){

    const {userName,password} = req.body;
    // console.log(userName,password);
    console.log(req.body)
   
    console.log("Geeting the data")

    //find buyer userName in DB

    

    //compare bcrypt password;

    //create jwt token

    //set cookies to response

    //return success message

}



async function handleBuyers (req,res){

    console.log(req.body);
    console.log("Buyer Api Hitt!!!!")

    return res.status(200)
}





module.exports ={handleBuyers,handleRegistration,handleLogin}