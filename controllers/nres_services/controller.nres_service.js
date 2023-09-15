
const { wrapAwait } = require("../../errorHandling");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const { registerServiceProvider, getServiceProvider, getPendingServiceProvider, verifyServiceProvider } = require("../../models/services/nres_service/service.nres_service");

const imagePath = "uploads/users/agent/images";
const maxSixe = 2 * 1024 * 1024;
const upload = new UploadImage(imagePath, maxSixe).upload.single('image');


const  utility = require("../controller.utils");
const utils   = utility.utility();

const handleRegisterServiceProvider = async function (req, res,next) {


     upload(req,res,async function(err){
        utils.handleMulterError(req,res,err,registration,true)
       
      })
     
       async function registration(){
            const { name, phone_number, email, service_type, state, district, city, ward_number } = req.body;
            console.log(req.body)
            const image = JSON.stringify({"identification":req.file.path});
  
            const isEmailValid = utils.isValid.email(email);
            const isPhoneNumberValid = utils.isValid.phoneNumber(phone_number);
          
            if( ! isEmailValid ) {
                return res.status(400).json({message:"Invalid Email"});   
              }
              if( ! isPhoneNumberValid){
                return res.status(400).json({message:"Invalid Phone Number"});   
              }
           
            const values ={
                name:name,
                email:email,
                phone_number:phone_number,
                service_type:service_type,
                state:state,
                district:district,
                city:city,
                ward_number:ward_number,
                profileImage:imagePath
            };
            
            const [response,responseError] = await wrapAwait(registerServiceProvider(values))

            if(responseError){
                console.log(responseError);
                if(responseError.name==='SequelizeUniqueConstraintError'){
                    return res.status(400).json({message:"Service Provider Already Register"})
                }
                return res.status(500).json({message:"Internal Error"});
          
            }
            return res.status(200).json({message:"Service Provider Registration success"})
             
            }
            
           
        }

       






const handleGetServiceProvider  = async function (req,res){


    

    return utils.getSearchData(req,res,getServiceProvider);
   
}


const handleGetPendingServiceProvider = async function (req,res){
    
    return utils.getSearchData(req,res,getPendingServiceProvider);
}


const handleVerifyServiceProvider = async function(req,res){
    let {status,provider_id} = req.params;
    if(status!=='approved' && status!=='rejected'){
        return res.status(400).json({message:"Status only contain approved or reject"})
    }

    try {
        const data = await verifyServiceProvider(status,provider_id);
       
        return res.status(200).json({message:"Update Successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"unable to update"});
    }
}




module.exports = {handleRegisterServiceProvider,handleGetServiceProvider,handleVerifyServiceProvider,handleGetPendingServiceProvider}