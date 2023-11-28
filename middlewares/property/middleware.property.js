const { handleErrorResponse } = require("../../controllers/controller.utils");
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




module.exports = {
    checkCustomerPropertyLimitation,
    checkAgentPropertyLimitation
}