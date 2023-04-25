const {insertHouseProperty}   = require("../../models/property/models.property");

// only for test purpose

const handleAddHouse = async (req,res)=>{

   const {property,houseProperty} = req.body;
   console.log(req.body)

     console.log("Add House API HITTTTT !!!!!!");
     try {
        await insertHouseProperty(property,houseProperty);
        return res.status(200).json({message:"Insert into table"});
     } catch (error) {
        return res.status(400).json({message:"Error occur"})
     }

}


module.exports = {handleAddHouse}