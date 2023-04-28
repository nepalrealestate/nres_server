
const {insertHouseProperty, getHouseProperty, insertHouseFeedback}   = require("../../models/property/model.house")

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


const handleGetHouse = async (req,res)=>{

 


  let page, limit ,offSet;

  // if page and limit not set then defualt is 1 and 20 .
   page = req.query.page || 1;
   
   limit = (req.query.limit < 20 )? req.query.limit : 20 || 20;
   // if page and limit present in query then delete it 
   if(req.query.page)  delete  req.query.page;
   
   if(req.query.limit) delete req.query.limit;
     
  

   offSet = (page-1) * limit;





   try {
      const houseData = await getHouseProperty(req.query,limit,offSet);
      console.log(houseData)
   
      return res.status(200).json(houseData);
   } catch (error) {
      return res.status(500).json({message:"Internal Server Error"});
   }

}



const handleHouseFeedback = async (req,res)=>{

   const {property_ID,feedback} = req.body;
   
   try {
      const result = await insertHouseFeedback(property_ID,feedback);
      return res.status(200).json({message:"Feedback Submit"});
   } catch (error) {
      console.log(error);
      return res.status(500).json({message:"Internal Serval Error"})
   }

}





module.exports = {handleAddHouse,handleGetHouse,handleHouseFeedback}