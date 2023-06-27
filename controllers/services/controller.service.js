


//id,name,phone_number,email,service_type,state,district,city,ward_number,profile_image,status

const { wrapAwait } = require("../../errorHandling")
const { registerServiceProvider, getServiceProvider, verifyServiceProvider } = require("../../models/services/model.service")
const multer = require('multer')
const validator = require("email-validator");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const imagePath = "uploads/users/agent/images";
const maxSixe = 2 * 1024 * 1024;
const upload = new UploadImage(imagePath, maxSixe).upload.single('image');



const handleRegisterServiceProvider = async function (req, res) {


    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log(err)
            return res.status(400).json({ message: "Error while uploading", err })
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ message: "Error while uploading", err })
        }



        const { name, phone_number, email, service_type, state, district, city, ward_number } = req.body;


        const imagePath = req?.file?.path||null;
        if(!imagePath){
            return res.status(400).json({message:"Please Upload Your Image"});
        }

        const numberRegex = /(\+977)?[9][6-9]\d{8}/;

        if(email!="null"){
            if(!validator.validate(email)){
                return res
                .status(400)
                .json({ message: "Invalid Email" });
            }
        }

        if (
            
            !phone_number.match(numberRegex)
        ) {
            return res
                .status(400)
                .json({ message: "Invalid phone Number" });
        }

        const values =[name,phone_number,email,service_type,state,district,city,ward_number,imagePath];
        console.log(values)
        
        
        const [response,responseError] = await wrapAwait(registerServiceProvider(values))

        if(responseError){
            console.log(responseError)
            return res.status(500).json({message:"Register Error"});
        }

        return res.status(200).json({message:"Registration successfully"});

    })

}


const handleGetServieProvider  = async function (req,res){

    let page, limit, offSet;

    // if page and limit not set then defualt is 1 and 20 .
    page = req.query.page || 1;
  
    limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
    // if page and limit present in query then delete it
    if (req.query.page) delete req.query.page;
  
    if (req.query.limit) delete req.query.limit;
  
    offSet = (page - 1) * limit;
  
    try {
      const data = await getServiceProvider(req.query, limit, offSet);
      console.log(data);
  
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.sqlMessage });
    }
   

}

const handleVerifyServiceProvider = async function(req,res){
    let {provider_id} = req.params;

    try {
        const data = await verifyServiceProvider(provider_id);
        if(data.affectedRows===0){
            return res.status(404).json({message:"No Data To Update"});
        }
        return res.status(200).json({message:"Update Successfully"});
    } catch (error) {
        return res.status(500).json({message:"unable to update"});
    }
}

module.exports = {handleRegisterServiceProvider,handleGetServieProvider,handleVerifyServiceProvider}