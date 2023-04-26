const {insertApartmentProperty}   = require("../../models/property/models.property");



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






module.exports = {handleAddApartment}