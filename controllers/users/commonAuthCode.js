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



const verifyToken = (req, res, next) => {
  //geeting cookies from frontEnd
  const cookies = req.headers.cookie;
  // console.log("THIS IS COOKIES",req.headers.cookie);
  if (!cookies) {
    console.log("No cookies Bro !!!!!!!");
    return res.status(404).json({ message: "Cannot get information" });
  }

  const token = cookies.split("=")[1];
  console.log(token);
  if (!token) {
    return res.status(404).json({ message: "No Token found" });
  }
  jwt.verify(String(token), process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    console.log(user.email);
    //set request id
    req.id = user.email;
  });
  console.log("Token Verify  !!!");
  //go to next function in router
  next();
};

const refreshToken = async (req, res, next) => {
  const cookies = req.headers.cookie;
  let prevToken;
  if (typeof cookies === "string") {
    prevToken = cookies.split("=")[1]; //slipt headers from token
  }

  if (!prevToken) {
    return res.status(400).json({ message: "No Token found" });
  }

  jwt.verify(String(prevToken), process.env.JWT_KEY, (err, decode) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication Failed" });
    }

    //clear cookies from response
    res.clearCookie(`${decode.email}`);
    //clear cookies from headers
    req.cookies[`${decode.email}`] = "";

    //generate new token
    const newToken = jwt.sign({ id: decode.email }, process.env.JWT_KEY, {
      expiresIn: tokenExpireTime,
    });

    //set new Token to cookie
    res.cookie(String(decode.email), newToken, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 1000 * 60),
      httpOnly: true,
      sameSite: "lax",
    });

    //set request id to user id
    req.id = decode.email;
    console.log("Refresh TOken Successfull  ");
    next();
  });
};









module.exports = {login,verifyToken,refreshToken};