const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const {insertApartmentProperty, getApartmentProperty, insertApartmentFeedback, getApartmentByID, insertApplyApartmentProperty, getApplyApartmentProperty, approveApartment}   = require("../../models/property/model.apartment");
const { updatePropertyViews, insertPropertyOwnership } = require("../../models/property/model.property");

const path  = 'uploads/property/apartment/images'  //path from source 
const maxImageSize = 2 * 1024 * 1024

const upload = new UploadImage(path,maxImageSize).upload.array('image',10);
const multer = require("multer");


// ------------------------------------------INSERT DATA RELATED ---------------------------------


const handleAddApartment = async (req,res)=>{


   upload(req, res,async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({message:"Error while uploading",err})
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(400).json({message:"Error while uploading",err})
      }
  
      // Everything went fine.
      
    
    

      const images = req.files ;

      if(!req.files){
          return res.status(400).json({message:"missing images of your property"})
      }
      
      // get user id from req.id i.e we set req.id when verify token
      const user_id = req.id;
      // baseUrl provide us from where request coming from ex. /agnet,/staff,/seller
      const user_type = req.baseUrl.substring(1);
      
      if(!req.body.property){
         return res.status(400).json({message:"missing property "});
      }
      
      const {property,apartmentProperty} = JSON.parse(req.body.property)
      console.log(property,apartmentProperty)


      apartmentProperty.apartment_image = images.reduce((acc, value, index) => ({ ...acc, [index]: value.path }), {});
      apartmentProperty.apartment_image = JSON.stringify(apartmentProperty.apartment_image);

      console.log(apartmentProperty)
      
     
   
        console.log("Add Apartment API HITTTTT !!!!!!");
        try {
           //await insertApartmentProperty(property,apartmentProperty,user_id,user_type);

            await insertApplyApartmentProperty(property,apartmentProperty,user_id,user_type);

           return res.status(200).json({message:"Insert into table"});
        } catch (error) {
         console.log("Why this error",error);
           return res.status(400).json({message:error})
        }
    })

  

}


const handleApartmentFeedback = async (req,res)=>{

   const {property_ID,feedback} = req.body;
   
   try {
      const result = await insertApartmentFeedback(property_ID,feedback);
      return res.status(200).json({message:"Feedback Submit"});
   } catch (error) {
      console.log(error);
      return res.status(500).json({message:error.sqlMessage})
   }

}

// ---------------------------------------------------------GET DATA RELATED-------------------------------------------------------


const handleGetApartment = async (req,res)=>{

 


  let page, limit ,offSet;

  // if page and limit not set then defualt is 1 and 20 .
   page = req.query.page || 1;
   
   limit = (req.query.limit < 20 )? req.query.limit : 20 || 20;
   // if page and limit present in query then delete it 
   if(req.query.page)  delete  req.query.page;
   
   if(req.query.limit) delete req.query.limit;
     
  

   offSet = (page-1) * limit;





   try {
      const apartmentData = await getApartmentProperty(req.query,limit,offSet);
      console.log(apartmentData)
   
      return res.status(200).json(apartmentData);
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage});
   }

}


const handleGetApplyApartment = async (req,res)=>{
   let page, limit ,offSet;

  // if page and limit not set then defualt is 1 and 20 .
   page = req.query.page || 1;
   
   limit = (req.query.limit < 20 )? req.query.limit : 20 || 20;
   // if page and limit present in query then delete it 
   if(req.query.page)  delete  req.query.page;
   
   if(req.query.limit) delete req.query.limit;
     
  

   offSet = (page-1) * limit;





   try {
      const apartmentData = await getApplyApartmentProperty(req.query,limit,offSet);
      console.log(apartmentData)
   
      return res.status(200).json(apartmentData);
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage});
   }
}




const handleGetApartmentByID = async (req,res)=>{

   const {property_ID}  = req.params;
   console.log(property_ID);

   try {
      const result = await getApartmentByID(property_ID);// get single  apartment by property 
      // if there is apartment then also update views
      if(result){
         await updatePropertyViews(property_ID);
      }
      console.log(result);
      return res.status(200).json({result});
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage})
   }

}


//-----------------------------------------------UPDATE RELATED--------------------------------------------------------------


const handleUpdateApartmentViews = async (req,res)=>{

   const {property_ID} = req.params;
   console.log(req.params);

   try {
      const result = await updatePropertyViews(property_ID); // update property views common function to update views in parent table property
      return res.status(200).json({message:"Views update successfully"});
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage})
      
   }

}

const handleApproveApartment = async (req,res)=>{

   const {property_id} = req.params;
   console.log(property_id);
   const staff_id  = req.id;

   try {
      await approveApartment(staff_id,property_id);
      return res.status(200).json({message:"approve successfully"});
   } catch (error) {
      return res.status(500).json({message:"approved denied ! please try later"});
   }

}





module.exports = {handleAddApartment,
   handleGetApartment,
   handleApartmentFeedback,
   handleUpdateApartmentViews,
   handleGetApartmentByID,
   handleGetApplyApartment,
   handleApproveApartment
}