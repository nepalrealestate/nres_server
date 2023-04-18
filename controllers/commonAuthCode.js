const bcrypt = require('bcrypt');


const jwt = require("jsonwebtoken");

const saltRound  = 10;

const tokenExpireTime = '1hr';





const login = async (req,res,user)=>{

    const {password} = req.body;


    if (!user) {
        console.log("No User Found");
        return res.status(404).send("User Not Found");
      }

    //compare bcrypt password;

    const match = await bcrypt.compare(password,user.password);

    if(!match){
        return res.status(401).json({message:"Password doesnot match"});
    }


    //create jwt token

     
  const token = jwt.sign({ id: user.email }, process.env.JWT_KEY, {
    expiresIn: tokenExpireTime,
  });

  //In Browser Remove Cookiess - 

  //------------------This code works only for browser cookie---------------------------

 //if cookie already present then remove;
  // let checkCookie = req.headers.cookie;
  // //console.log("Checking Cookie.......", checkCookie);
  // console.log(req.cookies)
  // if (req.cookies[`${user.email}`]) {
  //   req.cookies[`${user.email}`] = "";
  // }
   
  // //if there are two or more than different users login cookies then remove it from loop

  // if (checkCookie) {
  //   let cookieArray = req.headers.cookie.split(";");
  //   console.log(cookieArray);
  //   cookieArray.forEach((cookie) => {
  //     let key = cookie.trim().split("=")[0];
  //     if (req.cookies[`${key}`]) {
  //       //if user cookie already present then remove it
  //       console.log("This cookie already present", key);
  //       //req.cookies[`${key}`]="";
  //       res.clearCookie(`${key}`, { path: "/" });
  //       return;
  //     }
  //   });
  // }




     //set cookies to response
  res.cookie(String(user.email), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 1000 * 60),
    httpOnly: true,
    sameSite: "lax",
  });
    //return success message
    return res.status(200).json({ message: "Successfully Logged In", token });

}

module.exports = {login};