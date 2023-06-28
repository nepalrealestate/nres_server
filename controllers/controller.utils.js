
const multer = require('multer')

function Utility(){
    //variables
    const numberRegex = /(\+977)?[9][6-9]\d{8}/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  



   this.getSearchData = async function (req,res,getDataFunction){
    let page, limit, offSet;

    // if page and limit not set then defualt is 1 and 20 .
    page = req.query.page || 1;
  
    limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
    // if page and limit present in query then delete it
    if (req.query.page) delete req.query.page;
  
    if (req.query.limit) delete req.query.limit;
  
    offSet = (page - 1) * limit;

    try {
        const data = await getDataFunction(req.query, limit, offSet);
        console.log(data);
    
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ message: error.sqlMessage });
      }


   }

   this.isValid={
   
    phoneNumber:async function (phoneNumber){
        return phoneNumber.match(numberRegex);
    },

    email:async function (email){
            return email.match(emailRegex);
    }

   }

}




module.exports = Utility