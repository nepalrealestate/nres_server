


//id,name,phone_number,email,service_type,state,district,city,ward_number,profile_image,status

const { wrapAwait } = require("../../errorHandling")
const { registerServiceProvider } = require("../../models/services/model.service")
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

module.exports = {handleRegisterServiceProvider}