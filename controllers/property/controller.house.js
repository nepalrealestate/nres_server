
const {insertHouseProperty, getHouseProperty, insertHouseFeedback, getHouseByID}   = require("../../models/property/model.house")
const {updatePropertyViews}  = require("../../models/property/models.property");

// only for test purpose

const handleAddHouse = async (req,res)=>{

   const {property,houseProperty} = req.body;
   console.log(req.body)

     console.log("Add House API HITTTTT !!!!!!");
     try {
        await insertHouseProperty(property,houseProperty);
        return res.status(200).json({message:"Insert into table"});
     } catch (error) {
        return res.status(400).json({message:error.sqlMessage})
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
      return res.status(500).json({message:error.sqlMessage});
   }

}



const handleHouseFeedback = async (req,res)=>{

   const {property_ID,feedback} = req.body;
   
   try {
      const result = await insertHouseFeedback(property_ID,feedback);
      return res.status(200).json({message:"Feedback Submit"});
   } catch (error) {
      console.log(error);
      return res.status(500).json({message:error.sqlMessage})
   }

}

const handleUpdateHouseViews = async (req,res)=>{

   const {property_ID} = req.params;
   console.log(req.params);

   try {
      const result = await updatePropertyViews(property_ID);//update property views common function to update views in parent table property
      return res.status(200).json({message:"Views update successfully"});
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage})
      
   }

}

const handleGetHouseByID = async (req,res)=>{
   const {property_ID}  = req.params;
   console.log(property_ID);

   try {
      const result  = await getHouseByID(property_ID);//get single house
      // if there is house present then also update views
      if(result){
         await updatePropertyViews(property_ID);
      }
      return res.status(200).json({result});
   } catch (error) {
      return res.status(500).json({message:error.sqlMessage});
   }
}






module.exports = {handleAddHouse,handleGetHouse,handleHouseFeedback,handleUpdateHouseViews,handleGetHouseByID}