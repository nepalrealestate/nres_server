

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
            const imagePath = req?.file?.path 
            utils.isValid.email(res,email);
            utils.isValid.phoneNumber(res,phone_number)
    
            const values =[name,phone_number,email,service_type,state,district,city,ward_number,imagePath];
        
            utils.handleRegistration(res,registerServiceProvider,values);
            
           
        }

       



}


const handleGetServieProvider  = async function (req,res){

    return utility.getSearchData(req,res,getServiceProvider);
   
}


const handleGetPendingServiceProvider = async function (req,res){
    
    return utility.getSearchData(req,res,getPendingServiceProvider);
}


const handleVerifyServiceProvider = async function(req,res){
    let {status,provider_id} = req.params;
    if(status!=='approved' && status!=='rejected'){
        return res.status(400).json({message:"Status only contain approved or reject"})
    }

    try {
        const data = await verifyServiceProvider(status,provider_id);
        if(data.affectedRows===0){
            return res.status(404).json({message:"No Data To Update"});
        }
        return res.status(200).json({message:"Update Successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"unable to update"});
    }
}




module.exports = {handleRegisterServiceProvider,handleGetServieProvider,handleVerifyServiceProvider,handleGetPendingServiceProvider}