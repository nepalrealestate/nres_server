

function propertyServiceUtility(){


    const getProperty = async function(condition,PropertyModel){

        let orderConditions = [["createdAt", "DESC"]];
        let whereConditions = {};
      
        if (condition.district) {
          orderConditions.unshift([
            db.sequelize.literal(
              `(CASE WHEN district='${condition.district}' THEN 1 ELSE 2 END)`
            ),
            "ASC",
          ]);
          delete condition.district;
        }
        let location;
        if (condition.location) {
          location = condition.location;
          whereConditions[db.Op.or] = [
            { province: { [db.Op.like]: `%${location}%` } },
            { district: { [db.Op.like]: `%${location}%` } },
            { municipality: { [db.Op.like]: `%${location}%` } },
          ];
        }
      
        // Handle price range filtering
        if (condition.priceRange) {
          if (condition.priceRange.minPrice && condition.priceRange.maxPrice) {
            whereConditions.price = {
              [db.Op.between]: [
                condition.priceRange.minPrice,
                condition.priceRange.maxPrice,
              ],
            };
          } else if (condition.priceRange.minPrice) {
            whereConditions.price = {
              [db.Op.gte]: condition.priceRange.minPrice,
            };
          } else if (condition.priceRange.maxPrice) {
            whereConditions.price = {
              [db.Op.lte]: condition.priceRange.maxPrice,
            };
          }
      
         
        }
      
        delete condition.location;
        delete condition.priceRange;
        console.log(condition);

        return await PropertyModel.findAll({
          where: whereConditions,
          attributes: { exclude: ["id"] },
          order: orderConditions,
          // replacements: [condition.district],
          limit: condition.limit,
          offset: condition.offset,
        });

    }

    return{
        getProperty
    }

}


module.exports = {propertyServiceUtility}