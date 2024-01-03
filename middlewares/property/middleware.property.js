const { handleErrorResponse } = require("../../controllers/controller.utils");
const { getApartmentByID } = require("../../models/services/property/service.apartment");
const { getHouseByID } = require("../../models/services/property/service.house");
const { getLandByID } = require("../../models/services/property/service.land");
const { countListingProperty } = require("../../models/services/property/service.property");
const { getCustomerPropertyLimit, isAgentVerified } = require("../../models/services/users/service.user");


const checkCustomerPropertyLimitation = async (req, res, next) => {
    const user_id = req.id;

    try {   
        // Use Promise.all to concurrently execute both asynchronous functions
        const [totalProperty, customerPropertyLimit] = await Promise.all([
            countListingProperty({ owner_id: user_id }),
            getCustomerPropertyLimit(user_id)
        ]);
        if (totalProperty >= customerPropertyLimit.property_limit) {
            return res.status(400).json({ message: "You have reached your limit" });
        }
        next();
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


const checkAgentPropertyLimitation = async (req, res, next) => {
    const user_id = req.id;
    try {
        const agent = await isAgentVerified(user_id);
        if(agent.verified == "0"){
            const totalProperty = await countListingProperty({ owner_id: user_id });
            console.log("Total Property",totalProperty)
            if (totalProperty >= 1) {
                return res.status(400).json({ message: "You have reached your limit" });
            }
        }
   
        next();
    } catch (error) {
        handleErrorResponse(res,error)
    }
}



const checkPropertyValid  = async (req,res,next) => {
    let property_id = null;
    if(req.params.property_id){
        property_id = req.params.property_id;
    }
    if(req.body.property_id){
        property_id = req.body.property_id;
    }
    if(property_id == null){
        return res.status(400).json({message:"property_id is required"})
    }
    let property_type = req.body?.property_type;
    console.log(property_id,property_type)
    console.log(property_type=="house");
    console.log(property_type!="house")
    if( property_type != "house" && property_type != "apartment" && property_type != "land"){
        return res.status(400).json({message:"valid property_type is required"})
    }

    // check property is present or not
    const getProperty = {
        "house":getHouseByID,
        "apartment":getApartmentByID,
        "land":getLandByID
    }
    try {
        const response = await getProperty[property_type](property_id,['property_id']);
        if(!response){
            return res.status(400).json({message:"Invalid Property"})
        
        }
        next();
    } catch (error) {
        handleErrorResponse(res,error)
    }


}




module.exports = {
    checkCustomerPropertyLimitation,
    checkAgentPropertyLimitation,
    checkPropertyValid
}