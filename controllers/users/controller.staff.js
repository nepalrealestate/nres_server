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
  getStaffProfile,
} = require("../../models/services/users/service.staff");
const { wrapAwait } = require("../../errorHandling");

const utility = require("../controller.utils");

const saltRound = 10;
const tokenExpireTime = "1hr";
const JWT_KEY = process.env.JWT_KEY_AGENT;
const auth = utility.authUtility(tokenExpireTime, saltRound, JWT_KEY, "staff");

const utils = utility.utility();
const user = utility.userUtility("staff");
const { UploadImage, deleteFiles } = require("../../middlewares/middleware.uploadFile");
const { sendPasswordToStaff, sendPasswordEmail } = require("../../middlewares/middleware.sendEmail");
const { insertStaffProfile, registerAdmin, findAdmin, deleteAdmin } = require("../../models/services/users/service.admin");
const { sequelize } = require("../../models/model.index");

const imageFolderPath = "uploads/users/staff/";
const maxImageSize = "";
const { upload } = new UploadImage(imageFolderPath, maxImageSize);

const handleGetStaffByID = async function (req, res) {
  let staff_id;
  if(req.params.staff_id){
    staff_id = req.params.staff_id;
  }else{
    staff_id = req.id;
  }
   
  try {
    const data = await getStaffProfile(staff_id);
    if(!data){
      return res.status(404).json({message:"Staff Not Found"})
    }
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

    if (!isEmailValid || !isPhoneNumberValid) {
      return res.status(400).json({ message: "Invalid Input fields" })
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
    let documentsObject = (
      req.files.reduce(
        (acc, value, index) => ({ ...acc, [index]: value.path }),
        {}
      )
    );;


    const staffProfile = {
      name,
      email,
      gender,
      address,
      contact,
      responsibility,
      date_of_birth,
      recruited_date,
      tenure,
      salary,
      qualification,
      pan_no,
      documents: documentsObject,
    }

    const staffAccount = {
      admin_type: "staff",
      name: name,
      email: email,
      password: hashPassword
    }


    //store details in DB
    const transaction = await sequelize.transaction() ;
    try {
      const accountResponse = await registerAdmin("staff", name, email, hashPassword,{transaction});
      const profileResponse = await insertStaffProfile({ admin_id: accountResponse.admin_id, ...staffProfile },{transaction});
      console.log("accountResponse",accountResponse)
      console.log("profileResponse",profileResponse)
      // if(!profileResponse){
      //   console.log(profileResponse,"Roll back Commit")
      //   transaction.rollback();
      // }

      

      sendPasswordEmail(email, password).catch((err) => console.log(err));

      await transaction.commit();

      return res.status(200).json({ message: "Registration Succesfully" });
    } catch (error) {
      await transaction.rollback();
      if (req.files) {
        deleteFiles(req.files)
      }
      utility.handleErrorResponse(res, error)
    }
  }
};

const handleStaffUpdate = async (req, res) => {
  const staff_id = req.params.staff_id;

  const updateData = req.body;
  console.log(updateData)


  try {
    const response = await updateStaff(staff_id, updateData);
    if(response['0']===0){
      return res.status(400).json({message:"unable to update"})
    }
    return res.status(200).json({ message: "Update Successfully" });
  } catch (error) {
    utility.handleErrorResponse(res,error)
  }
}

const handleStaffDelete = async (req, res) => {
  const staff_id = req.params.staff_id;

  try {
    const response = await deleteAdmin(staff_id)
    if(response===0){
      return res.status(400).json({message:"Unable to delete"})
    }
    return res.status(200).json({ message: "Delete Successfully" });
  } catch (error) {
    utility.handleErrorResponse(res,error)
  }
}

const handleStaffLogin = async (req, res) => {
  const { email } = req.body;
  try {
    const staff = await findAdmin(email,"staff");
    console.log(staff)
    if(!staff){
      return res.status(404).json({message:"Staff Not Found"})
    }
    return auth.login(req, res, staff);
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};


const handleGetAllStaff = async (req, res) => {
  

  let condition = {};
  if (req.query?.name) {
    condition.name = req.query.name;
  }
  try {
    const data = await getAllStaff(condition);
    return res.status(200).json(data)
  } catch (error) {

    utility.handleErrorResponse(res, error)
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
  handleGetStaffByID,
  handleStaffRegistration,
  handleStaffLogin,
  handleStaffPasswordReset,
  staffVerifyToken,
  handleGetAllStaff,
  handleStaffUpdate,
  handleStaffDelete
};
