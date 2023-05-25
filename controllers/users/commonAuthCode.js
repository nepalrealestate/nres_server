const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const {
  insertIntoPasswordResetToken,
  findPasswordResetTokenValue,
  updatePasswordResetTokenValue,
  deleteToken,
} = require("../../models/users/model.commonUsersCode");
const {
  getRandomNumber,
  sendTokenToUserByEmail,
} = require("./controller.commonFunction");

const { wrapAwait } = require("../../errorHandling");
const { error } = require("console");

const saltRound = 10;

const tokenExpireTime = "1hr";
const schemaName = "nres_users";

const login = async (req, res, user) => {
  const { password } = req.body;

  

  if (!user) {
    console.log("No User Found");
    return res.status(404).send("User Not Found");
  }
  console.log(user)

  //compare bcrypt password;

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Password doesnot match" });
  }

  //create jwt token

  const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: tokenExpireTime,
  });

  //In Browser Remove Cookiess -

  //------------------This code works only for browser cookie---------------------------

  //if cookie already present then remove;
  //console.log(req.headers.cookie);
  let checkCookie = req.headers.cookie;
  //console.log("Checking Cookie.......", checkCookie);
  
  if (req.cookies[`${user.id}`]) {
    console.log("THe cookies from insdie")
    console.log(req.cookies[`${user.id}`])
    req.cookies[`${user.id}`] = ""; // set null if already present 
    //res.clearCookie(`${user.id}`,{path: "/"});// if already set on response 
   
  }

  // //if there are two or more than different users login cookies then remove it from loop
// not fully optimized solution
  if (checkCookie) {
    let cookieArray = req.headers.cookie.split(";");
    console.log(cookieArray);
    cookieArray.forEach((cookie) => {
      let key = cookie.trim().split("=")[0];
      if (req.cookies[`${key}`]) {
        //if user cookie already present then remove it
        console.log("This cookie already present", key);
        //req.cookies[`${key}`]="";
        res.clearCookie(`${key}`, { path: "/" });
        return;
      }
    });
  }

  //set cookies to response
  res.cookie(String(user.id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 1000 * 60),
    httpOnly: true,
    sameSite: "lax",
  });
  //return success message
  return res.status(200).json({ message: "Successfully Logged In", token });
};





const verifyToken = (req, res, next) => {
  //geeting cookies from frontEnd
 
  const cookies = req.headers.cookie;

  console.log("THIS IS COOKIES",req.headers.cookie);
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
      console.log(err)
      return res.status(400).json({ message: "Invalid Token" });
    }

    console.log(user.id);
    //set request id
    req.id = user?.id;
    console.log("Token Verify  !!!");
  //go to next function in router
   next();
  });

  
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

const passwordReset = async (req, res, user) => {
  if (!user) {
    return res.status(401).json({ message: "User Not Found!" });
  }

  const randomToken = getRandomNumber();

  const [resultToken, errorToken] = await wrapAwait(
    insertIntoPasswordResetToken(user.id, randomToken)
  );
  // if we get error of duplicate entry then update token value

  let isTokenUpdate = false;

  if (errorToken) {
    console.log(errorToken);
    if (errorToken.code === "ER_DUP_ENTRY") {// if duplicate entry the udpate token value
      const [resultUpdateToken, errorUpdateToken] = await wrapAwait(
        updatePasswordResetTokenValue(user.id, randomToken)
      );
      if (errorUpdateToken) {
        return res.status(500).json({ message: error.sqlMessage });
      }
      isTokenUpdate = true;
      console.log(isTokenUpdate);
    } else {
      console.log(errorToken);
      return res.status(500).json({ message: "server Error " });
    }
  }
  // if token insert in db or updated in db then send mail
  if (resultToken || isTokenUpdate) {
    sendTokenToUserByEmail(user.email, randomToken)
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return res
    .status(200)
    .json({ message: "Token re-generate sucessfully Check Your Email " });
};

const passwordUpdate = async (req, res, user, updateUserPassword) => {
  if (!user) {
    return res.status(401).json({ message: "User Not Found!" });
  }

  const { email, token } = req.query;

  // if email field empty
  if (!email) {
    return res.status(401).json({ message: "Please Enter Email" });
  }

  if (email && token && user) {
    // logic for update password
    const { password, confirmPassword } = req.body;
    // if password doesnot match
    if (password !== confirmPassword) {
      console.log(" New Password not match  ");
      return res.status(403).json({ message: " New Password  not match" });
    }

    const [storeToken, storeTokenError] = await wrapAwait(
      findPasswordResetTokenValue(user.id)
    );

    console.log(storeToken);

    // check expire date

    const expireDate = new Date(storeToken.expirationTime);
    const currentDate = new Date();
    const expireDay = expireDate.getUTCDate();
    const currentDay = currentDate.getUTCDate();

    if (storeToken.token !== token || storeTokenError) {
      return res.status(401).json({ message: "No Token Match" });
    }

    //if token expire
    if (Number(currentDay) >= Number(expireDay)) {
      return res
        .status(401)
        .json({ message: "Token Expire ! please generate New Token" });
    }

    const [hashPassword, hashPasswordError] = await wrapAwait(
      bcrypt.hash(password, saltRound)
    );

    if (hashPassword) {
      // this updateUser password return result in array in form of resolve and reject
      const [passwordUpdate, passwordUpdateError] = await updateUserPassword(
        user.id,
        hashPassword
      );
      if (passwordUpdate) {
        deleteToken(user.id).then(function () {
          console.log("token delete Successfully");
        });
        return res.status(200).json({ message: "Password Update succesfuly" });
      }

      if (passwordUpdateError) {
        console.log("password Update Error");
        return res.status(500).json({ message: "Password doesnot update" });
      }
    }

    return res.status(500).json({ message: "couldn't update password" });
  }
};

module.exports = {
  login,
  verifyToken,
  refreshToken,
  passwordReset,
  passwordUpdate,
};
