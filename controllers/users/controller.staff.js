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
  getStaffProfileByAdminID,
} = require("../../models/services/users/service.staff");
const { wrapAwait } = require("../../errorHandling");

const utility = require("../controller.utils");

const saltRound = 10;
const tokenExpireTime = "1hr";
const JWT_KEY = process.env.JWT_KEY_AGENT;
const auth = utility.authUtility(tokenExpireTime, saltRound, JWT_KEY, "staff");

const utils = utility.utility();
const user = utility.userUtility("staff");
const {
  UploadImage,
  deleteFiles,
} = require("../../middlewares/middleware.uploadFile");
const {
  sendPasswordToStaff,
  sendPasswordEmail,
} = require("../../middlewares/middleware.sendEmail");
const {
  insertStaffProfile,
  registerAdmin,
  findAdmin,
  deleteAdmin,
} = require("../../models/services/users/service.admin");
const { sequelize } = require("../../models/model.index");

const imageFolderPath = "uploads/users/staff/";
const maxImageSize = "";
const { upload } = new UploadImage(imageFolderPath, maxImageSize);

const handleGetStaffByID = async function (req, res) {
  let staff_id;
  if (req.params.staff_id) {
    staff_id = req.params.staff_id;
  } else {
    staff_id = req.id;
  }

  try {
    const data = await getStaffProfile(staff_id);
    if (!data) {
      return res.status(404).json({ message: "Staff Not Found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

const handleStaffRegistration = async (req, res) => {
  upload.array("documents", 2)(req, res, async function (err) {
    utils.handleMulterError(req, res, err, registration, false);
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
      account_access,
    } = JSON.parse(req.body.staff);
    const isEmailValid = utils.isValid.email(email);
    const isPhoneNumberValid = utils.isValid.phoneNumber(contact);

    if (!isEmailValid || !isPhoneNumberValid) {
      return res.status(400).json({ message: "Invalid Input fields" });
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
    let documentsObject = {};
    if (req.files || req.file) {
      let image = req?.files || req?.file;
       documentsObject = image.reduce(
        (acc, value, index) => ({ ...acc, [index]: value.path }),
        {}
      );
    }

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
      account_access,
      documents: documentsObject,
    };

    const staffAccount = {
      admin_type: "staff",
      name: name,
      email: email,
      password: hashPassword,
    };

    //store details in DB
    const transaction = await sequelize.transaction();
    try {
      let admin_id = null;
      if (account_access === true) {
        const accountResponse = await registerAdmin(
          "staff",
          name,
          email,
          hashPassword,
          { transaction }
        );
        admin_id = accountResponse.admin_id;
      }

      const profileResponse = await insertStaffProfile(
        { admin_id: admin_id, ...staffProfile },
        { transaction }
      );
      if(account_access === true){
        sendPasswordEmail(email, password).catch((err) => console.log(err));
      }

      

      await transaction.commit();

      return res.status(200).json({ message: "Registration Succesfully" });
    } catch (error) {
      await transaction.rollback();
      if (req.files) {
        deleteFiles(req.files);
      }
      if (req.file) {
        deleteFiles(req.file);
      }
      utility.handleErrorResponse(res, error);
    }
  }
};

//todo write code for update staff document
const handleStaffUpdate = async (req, res) => {
  upload.array("documents", 2)(req, res, async function (err) {
    utils.handleMulterError(req, res, err, update, false);
  });

  async function update() {
    const staff_id = req.params.staff_id;

    const updateData = JSON.parse(req.body.staff);
    if (req.files || req.file) {
      let image = req?.files || req?.file;
      updateData.documents = image.reduce(
          (acc, value, index) => ({ ...acc, [index]: value.path }),
          {}
      );
   }
   
    console.log("update Data",updateData)
   

    try {
      const getStaffResponse = await getStaffProfile(staff_id);
      if (!getStaffResponse) {
        return res.status(404).json({ message: "Staff Not Found" });
      }
      const response = await updateStaff(staff_id, updateData);
      if (response["0"] === 0) {
        return res.status(400).json({ message: "unable to update" });
      }
      if(getStaffResponse?.dataValues?.documents){
        deleteFiles(getStaffResponse?.dataValues?.documents)
      }
      return res.status(200).json({ message: "Update Successfully" });
    } catch (error) {
      if (req.files) {
        deleteFiles(req.files);
      }
      if (req.file) {
        deleteFiles(req.file);
      }
      utility.handleErrorResponse(res, error);
    }
  }
};

const handleStaffDelete = async (req, res) => {
  const admin_id = req.params.staff_id;

  try {
    // find staff profile from admin id 
    const staffProfile = await getStaffProfileByAdminID(admin_id);
    if (!staffProfile) {
      return res.status(404).json({ message: "Staff Not Found" });
    }
    const response = await deleteAdmin(admin_id);
    if (response === 0) {
      return res.status(400).json({ message: "Unable to delete" });
    }
    //change account access false
    await updateStaff(staffProfile?.dataValues?.staff_id , { account_access: false});
    return res.status(200).json({ message: "Delete Successfully" });
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleStaffLogin = async (req, res) => {
  const { email } = req.body;
  try {
    const staff = await findAdmin(email, "staff");
    console.log(staff);
    if (!staff) {
      return res.status(404).json({ message: "Staff Not Found" });
    }
    return auth.login(req, res, staff);
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};


const handleStaffLogout = async (req, res) => {
  return auth.logout(req, res);
}

const handleGetAllStaff = async (req, res) => {
  let condition = {};
  if (req.query?.search) {
    condition.search = req.query.search;
  }
  try {
    const data = await getAllStaff(condition);
    return res.status(200).json(data);
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

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

  try {
    const staffResponse = await findAdmin(email,"staff");
    if(!staffResponse){
      return res.status(400).json({message:"No Staff Found"});
    }

  } catch (error) {
    
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
  handleStaffDelete,
  handleStaffLogout
};
