const {createHouseTable}   = require("../../models/property/models.property");

// only for test purpose

const handleAddHouse = async (req,res)=>{
     console.log("Add House API HITTTTT !!!!!!");
     try {
        await createHouseTable();
        return res.status(200).json({message:"Create Table"});
     } catch (error) {
        return res.status(400).json({message:"Error occur"})
     }

}


module.exports = {handleAddHouse}