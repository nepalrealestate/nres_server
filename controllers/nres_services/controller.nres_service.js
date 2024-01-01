const { wrapAwait } = require("../../errorHandling");
const {
  UploadImage,
  deleteFiles,
  deleteSingleImage,
} = require("../../middlewares/middleware.uploadFile");
const {
  registerServiceProvider,
  getServiceProvider,
  getPendingServiceProvider,
  verifyServiceProvider,
  insertServiceProviderRating,
  deleteServiceProvider,
  getServiceProviderByID,
  updateServiceProvider,
} = require("../../models/services/nres_service/service.nres_service");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary");
const logger = require("../../utils/errorLogging/logger");

const imagePath = "uploads/users/agent/images";
const maxSixe = 2 * 1024 * 1024;
const upload = new UploadImage(imagePath, maxSixe).upload.single("image");

const utility = require("../controller.utils");
const utils = utility.utility();

const handleRegisterServiceProvider = async function (req, res, next) {
  upload(req, res, async function (err) {
    utils.handleMulterError(req, res, err, registration, true);
  });

  async function registration() {
    const providerData = req.body?.providerData;
    const {
      name,
      phone_number,
      email,
      gender,
      age,
      service_type,
      province,
      district,
      municipality,
      ward_number,
    } = JSON.parse(providerData);

    const imagePath = req?.file?.path;

    const isEmailValid = utils.isValid.email(email);
    const isPhoneNumberValid = utils.isValid.phoneNumber(phone_number);

    if (!isEmailValid) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    if (!isPhoneNumberValid) {
      return res.status(400).json({ message: "Invalid Phone Number" });
    }

    const values = {
      name: name,
      email: email,
      phone_number: phone_number,
      gender:gender,
      age:age,
      service_type: service_type,
      province: province,
      district: district,
      municipality: municipality,
      ward_number: ward_number,
      profileImage: null,
    };
    try {
      const response = await registerServiceProvider(values);
      if(imagePath){
        console.log("I am here")
        uploadOnCloudinary(imagePath,"service").then(async (result)=>{
          console.log("Image Upload Success",result)
          if(result){
            const updateResponse = await updateServiceProvider(response.dataValues.id,{profileImage:result.secure_url});
            console.log("Image Upload Success",updateResponse);
          }else{
            console.log("Image Upload Failed");
            logger.error("Image Upload Failed");
          }
          
        })
      }
      return res
        .status(200)
        .json({ message: "Service Provider Registration success" });
    } catch (error) {
      // if (cloudinaryResonse) {
      //   deleteFromCloudinary(cloudinaryResonse);
      //}
      utility.handleErrorResponse(res, error);
    }
  }
};

const handleGetServiceProvider = async function (req, res) {
  const [limit, offset] = utility.handleLimitOffset(req);
  const condition = {};
  if (req.query?.search) {
    condition.search = req.query.search;
  }
  try {
    const response = await getServiceProvider(condition, limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
  
};
const handleGetServiceProviderByID = async function (req, res) {
  const provider_id = req.params.provider_id;
  try {
    const data = await getServiceProviderByID(provider_id);
    if (!data) {
      return res.status(404).json({ message: "No Service Provider Found" });
    }
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {}
};

const handleVerifyServiceProvider = async function (req, res) {
  let { provider_id } = req.params;
  let { status } = req.body;
  console.log("Provider ID", provider_id);
  
  if (status !== "approved" && status !== "pending") {
    return res
      .status(400)
      .json({ message: "Status only contain approved or reject" });
  }

  try {
    const data = await verifyServiceProvider(status, provider_id);

    return res.status(200).json({ message: "Update Successfully" });
  } catch (error) {
    console.log(error);
    utility.handleErrorResponse(res, error);
  }
};

const handleDeleteServiceProvider = async function (req, res) {
  const { provider_id } = req.params;
  try {
    const provider = await getServiceProvider({ provider_id: provider_id });
    if (provider.length === 0) {
      return res.status(400).json({ message: "No Service Provider Found" });
    }
    const data = await deleteServiceProvider(provider_id);
    console.log("Before Delete", data);
    if (data === 0) {
      return res.status(400).json({ message: "No Service Provider Found" });
    }
    console.log("Delete Service Provider");
    if (provider.dataValues?.profileImage) {
      console.log("Delete Service Provider");
      deleteSingleImage(provider.dataValues.profileImage);
    }

    return res.status(200).json({ message: "Delete Successfully" });
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

const handleInsertServiceProviderRating = async function (req, res) {
  const { rating, review, provider_id } = req.body;
  const user_id = req.id;
  const values = {
    provider_id: provider_id,
    user_id: user_id,
    rating: rating,
    review: review,
  };
  try {
    const data = await insertServiceProviderRating(values);
    return res.status(200).json({ message: "Rating Submit Successfully" });
  } catch (error) {
    utility.handleErrorResponse(res, error);
  }
};

module.exports = {
  handleRegisterServiceProvider,
  handleGetServiceProvider,
  handleGetServiceProviderByID,
  handleVerifyServiceProvider,
  handleDeleteServiceProvider,
  handleInsertServiceProviderRating,
};
