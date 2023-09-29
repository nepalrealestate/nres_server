const db = require("../../model.index");

const Ads = db.AdsModel.Ads;

async function insertOrUpdateVideoAdsLink(link){

        return await Ads.upsert({
            id:1,
            link:link
        })   
  
}

async function getVideoAdsLink(){
    return await Ads.findOne({
        where:{
            id:1
        }
    })
}
module.exports = {insertOrUpdateVideoAdsLink,getVideoAdsLink};