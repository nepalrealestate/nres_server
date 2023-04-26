const {insertLandProperty}   = require("../../models/property/models.property");

// only for test purpose

const handleAddLand = async (req,res)=>{

   const {property,landProperty} = req.body;
   console.log(req.body)

     console.log("Add Land API HITTTTT !!!!!!");
     try {
        await insertLandProperty(property,landProperty);
        return res.status(200).json({message:"Insert into table"});
     } catch (error) {
        return res.status(400).json({message:"Error occur"})
     }

}






module.exports = {handleAddLand}