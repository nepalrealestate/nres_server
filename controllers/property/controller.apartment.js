const {insertApartmentProperty, getApartmentProperty, insertApartmentFeedback, getApartmentByID}   = require("../../models/property/model.apartment");
const { updatePropertyViews } = require("../../models/property/models.property");



const handleAddApartment = async (req,res)=>{

   const {property,apartmentProperty} = req.body;
   console.log(property);
   console.log(apartmentProperty);

     console.log("Add Apartment API HITTTTT !!!!!!");
     try {
        await insertApartmentProperty(property,apartmentProperty);
        return res.status(200).json({message:"Insert into table"});
     } catch (error) {
      console.log("Why this error",error.sqlMessage);
        return res.status(400).json({message:error.sqlMessage})
     }

}

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





module.exports = {handleAddApartment,handleGetApartment,handleApartmentFeedback,handleUpdateApartmentViews,handleGetApartmentByID}