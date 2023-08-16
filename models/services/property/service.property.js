const db = require("../../model.index");
const PropertyAdminView = db.Views.PropertyViewAdmin;


async function getPropertyWithAds(condition,limit,offset){

    return await PropertyAdminView.findAll({
        where:condition,
        attributes: { exclude: ['id'] },
        order:['property_id'],
        limit:limit,
        offset:offset
    })

}


module.exports = {getPropertyWithAds}