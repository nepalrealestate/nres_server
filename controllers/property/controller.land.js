const {insertLandProperty, getLandProperty, insertLandFeedback, getLandByID}   = require("../../models/property/model.land");
const { updatePropertyViews } = require("../../models/property/model.property");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const path  = 'uploads/property/land/images'  //path from source 
const maxImageSize = 2 * 1024 * 1024
const upload = new UploadImage(path,maxImageSize).upload.array('image',10);
const multer = require("multer");

const handleAddLand = async (req,res)=>{


   upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({message:err});
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(400).json({message:err});
      }
  
      // Everything went fine.

      if(!req.files){
         return res.status(400).json({message:"missing images of your property"})
     }
     const images = req.files
     
     // get user id from req.id i.e we set req.id when verify token
     const user_id = req.id;
     // baseUrl provide us from where request coming from ex. /agnet,/staff,/seller
     const user_type = req.baseUrl.substring(1);
     
     if(!req.body.property){
        return res.status(400).json({message:"missing property "});
     }
     
     const {property,landProperty} = JSON.parse(req.body.property)
     console.log(property,landProperty)


     landProperty.land_image = images.reduce((acc, value, index) => ({ ...acc, [index]: value.path }), {});
     landProperty.land_image = JSON.stringify(landProperty.land_image);




   
        console.log("Add Land API HITTTTT !!!!!!");
        try {
           await insertLandProperty(property,landProperty,user_id,user_type);
           return res.status(200).json({message:"Insert into table"});
        } catch (error) {
            console.log(error);
           return res.status(400).json({message:error.sqlMessage})
        }

    })

  

}


const handleGetLand = async (req,res)=>{



  let page, limit ,offSet;

  // if page and limit not set then defualt is 1 and 20 .
   page = req.query.page || 1;
   
   limit = (req.query.limit < 20 )? req.query.limit : 20 || 20;
   // if page and limit present in query then delete it 
   if(req.query.page)  delete  req.query.page;
   
   if(req.query.limit) delete req.query.limit;
     
  

   offSet = (page-1) * limit;





   try {
      const landData = await getLandProperty(req.query,limit,offSet);
      console.log(landData)
   
      return res.status(200).json(landData);
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage});
   }

}

const handleLandFeedback = async(req,res)=>{
   const {property_ID,feedback} = req.body;
   
   try {
      const result = await insertLandFeedback(property_ID,feedback);
      return res.status(200).json({message:"Feedback Submit"});
   } catch (error) {
      console.log(error);
      return res.status(500).json({message:error.sqlMessage})
   }
}
const handleUpdateLandViews = async (req,res)=>{

   const {property_ID} = req.params;
   console.log(req.params);

   try {
      const result = await updatePropertyViews(property_ID);// update property views common function to update views in parent table property;
      return res.status(200).json({message:"Views update successfully"});
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage})
      
   }

}

const handleGetLandByID = async (req,res)=>{
   const {property_ID} = req.params;

   try {
      const result  = await getLandByID(property_ID);//get single land
      //if there is land present then update views also;
      if(result){
         await updatePropertyViews(property_ID);
      }
      console.log(result);
      return res.status(200).json({result});
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage})
   }
}




module.exports = {handleAddLand,handleGetLand,handleLandFeedback,handleUpdateLandViews,handleGetLandByID}