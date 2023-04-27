const {insertApartmentProperty, getApartmentProperty}   = require("../../models/property/model.apartment");



const handleAddApartment = async (req,res)=>{

   const {property,landProperty} = req.body;
   console.log(req.body)

     console.log("Add Apartment API HITTTTT !!!!!!");
     try {
        await insertApartmentProperty(property,landProperty);
        return res.status(200).json({message:"Insert into table"});
     } catch (error) {
        return res.status(400).json({message:"Error occur"})
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
      return res.status(500).json({message:"Internal Server Error"});
   }

}




module.exports = {handleAddApartment,handleGetApartment}