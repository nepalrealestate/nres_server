const { insertOrUpdateVideoAdsLink, getVideoAdsLink } = require("../../models/services/ads/service.ads");
const {handleErrorResponse} = require("../controller.utils");

const handleInsertOrUpdateAds = async (req, res) => {
    const {link} = req.body;
    if(!link){
        return res.status(400).send({message:"Link is required"});
    }
    try {
        const result = await insertOrUpdateVideoAdsLink(link);
        res.status(200).send({message:"Success"});
    } catch (error) {
        handleErrorResponse(res, error);
    }
}

const handleGetAds = async (req, res) => {
    try {
        const result = await getVideoAdsLink();
       return res.status(200).json(result);;
    }catch(error){
        handleErrorResponse(res, error);
    }
}

module.exports = {handleInsertOrUpdateAds,handleGetAds};