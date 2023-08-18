const bcrypt = require("bcrypt");

const generator = require("generate-password");

const { insertVideoLink } = require("../../models/property/model.property");
const {
  registerStaff,
  findStaff,
  getStaff,
  updateStaffPassword,
  getAllStaff,
  updateStaff,
  deleteStaff,
} = require("../../models/services/users/service.staff");
const { wrapAwait } = require("../../errorHandling");

const utility = require("../controller.utils");

const saltRound = 10;
const tokenExpireTime = "1hr";
const JWT_KEY = process.env.JWT_KEY_AGENT;
const auth = utility.authUtility(tokenExpireTime, saltRound, JWT_KEY, "staff");

const utils = utility.utility();
const user = utility.userUtility("staff");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const { sendPasswordToStaff } = require("../../middlewares/middleware.sendEmail");

const imageFolderPath = "uploads/users/staff/";
const maxImageSize = "";
const { upload } = new UploadImage(imageFolderPath, maxImageSize);

const handleGetStaff = async function (req, res) {
  
  let staff_id;
  if(req.id){
    staff_id=req.id
}else{
    staff_id=req.params.staff_id;
}



  

  try {
    const data = await getStaff(staff_id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Error" });
  }
};

const handleStaffRegistration = async (req, res) => {
  upload.array("documents", 2)(req, res, async function (err) {
    utils.handleMulterError(req, res, err, registration, true);
  });

  async function registration() {
    
    const {
      name,
      gender,
      email,
      address,
      contact,
      responsibility,
      date_of_birth,
      recruited_date,
      tenure,
      salary,
      qualification,
      pan_no,
    } = JSON.parse(req.body.staff);
    const isEmailValid = utils.isValid.email(email);
    const isPhoneNumberValid = utils.isValid.phoneNumber(contact)

    if(!isEmailValid || !isPhoneNumberValid){
        return res.status(400).json({message:"Invalid Input fields"})
    }


    // generate random password ;
    const password = generator.generate({ length: 10, numbers: true });

    const [hashPassword, hashPasswordError] = await wrapAwait(
      bcrypt.hash(password, saltRound)
    );

    if (hashPasswordError) {
      return res
        .status(500)
        .json({ message: "Internal Error ! please try again" });
    }
    let documentsObject = JSON.stringify(
        req.files.reduce(
          (acc, value, index) => ({ ...acc, [index]: value.path }),
          {}
        )
      );;
   

    const staffData = {
      name,
      gender,
      email,
      address,
      contact,
      responsibility,
      date_of_birth,
      recruited_date,
      tenure,
      salary,
      qualification,
      pan_no,
      documents:documentsObject,  
      password:hashPassword
    }


    console.log(staffData)
    //store details in DB
    try {
      const result = await registerStaff(staffData);
      console.log(result);

      sendPasswordToStaff(email,password).catch((err)=>console.log(err));

      return res.status(200).json({ message: "Registration Succesfully" });
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:error.errors[0].message})
    }
  }
};

const handleStaffUpdate = async (req,res)=>{
    const staff_id = req.params.staff_id;
    

    try {
        const response = await updateStaff(staff_id,req.body);
        console.log(response)
        return res.status(200).json({message:"Update Successfully"});
    } catch (error) {
        return res.status(500).json({message:"Internal Error"});
    }
}

const handleStaffDelete = async (req,res)=>{
    const staff_id  = req.params.staff_id;

    try {
        const response = await deleteStaff(staff_id)
        return res.status(200).json({message:"Delete Successfully"});
    } catch (error) {
        return res.status(500).json({message:"Internal Error"})
        
    }
}

const handleStaffLogin = async (req, res) => {
  const { email } = req.body;

  //find staff userName in DB
  console.log(email);
  const [staff, staffError] = await wrapAwait(findStaff(email));
  console.log(staff);
  if (staffError) {
    return res.status(500).json({ message: "Internal Error" });
  }

  //this login function handle all logic

  return auth.login(req, res, staff);
};


const handleGetAllStaff = async (req,res)=>{
    
    try {
        const data = await getAllStaff();
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message:error?.errors[0]?.message})
    }

}


const handleStaffPasswordReset = async (req, res, next) => {
  // recive email in parameter

  // if we recieve only email then reset password
  // if we recieve token email and password (in body)
  // after update password - delete token

  const { email, token } = req.query;

  // if email field emptyempty
  if (!email) {
    return res.status(400).json({ message: "Please Enter Email" });
  }

  const [agent, agentError] = await wrapAwait(findStaff(email));
  if (email && token && agent) {
    // pass update Password function as parameters;
    return await user.passwordUpdate(req, res, agent, updateStaffPassword);
  }
  // if there is no token - then get token for reset password
  return await user.passwordReset(req, res, agent);
};

const staffVerifyToken = async (req, res, next) => {
  auth.verifyToken(req, res, next);
};

module.exports = {
  handleGetStaff,
  handleStaffRegistration,
  handleStaffLogin,
  handleStaffPasswordReset,
  staffVerifyToken,
  handleGetAllStaff,
  handleStaffUpdate,
  handleStaffDelete
};
