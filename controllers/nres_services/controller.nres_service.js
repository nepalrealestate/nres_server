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
} = require("../../models/services/nres_service/service.nres_service");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary");

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
    const {
      name,
      phone_number,
      email,
      service_type,
      state,
      district,
      city,
      ward_number,
    } = req.body;
    console.log(req.body);
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
      service_type: service_type,
      state: state,
      district: district,
      city: city,
      ward_number: ward_number,
      profileImage: imagePath,
    };
    try {
      let cloudinaryResonse = null;
      if (imagePath) {
        cloudinaryResonse = await uploadOnCloudinary(imagePath,"service");
      }
      if (!cloudinaryResonse) {
        return res.status(400).json({ message: "Image Upload Failed" });
      }
      values.profileImage = cloudinaryResonse.secure_url;
      const response = registerServiceProvider(values);
      return res
        .status(200)
        .json({ message: "Service Provider Registration success" });
    } catch (error) {
      if (cloudinaryResonse) {
        deleteFromCloudinary(cloudinaryResonse);
      }
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
  return utils.getSearchData(req, res, getServiceProvider);
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
    if (provider.dataValues.profileImage !== null) {
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
