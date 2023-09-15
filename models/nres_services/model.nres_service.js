
function serviceProviderModel(sequelize,DataTypes){
  return ServiceProvider = sequelize.define('service_provider',{
    provider_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true

    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
          isEmail:true,
          notEmpty:true
      }
    },
    phone_number:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
      notEmpty:true
    }
    },
    service_type:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    state:{
      type:DataTypes.STRING,
    },
    district:{
      type:DataTypes.STRING
    },
    city:{      
      type:DataTypes.STRING
    },
    ward_number:{
      type:DataTypes.INTEGER
    },
    profileImage:{
      type:DataTypes.STRING
    },
    status:{
      type:DataTypes.ENUM('pending','approved','rejected'),
      defaultValue:'pending'
    }

  },{
    freezeTableName:true
  })
}



function serviceProviderRatingModel(sequelize,Datatypes){
  return serviceProviderRating = sequelize.define('service_provider_rating',{
    provider_id:{
      type:Datatypes.INTEGER,
      allowNull:false,
      references:{
        model:'service_provider',
        key:'provider_id'
      }
    },
    user_id:{
      type:Datatypes.INTEGER,
      allowNull:false,
      references:{
        model:'user_userAccount',
        key:'user_id'
      }
    },
    rating:{
      type:Datatypes.INTEGER,
      allowNull:false,
    },
    review:{
      type:Datatypes.TEXT,
    }
  },{
    freezeTableName:true
  })
}

async function registerServiceProvider(providerData){

    const query = `INSERT INTO ${serviceTable.service_provider} (name,phone_number,email,service_type,state,district,city,ward_number,profile_image,status) VALUES (?,?,?,?,?,?,?,?,?,'pending')`;

    //provider data is comming in Array ;

    try {
        const [row,field] = await pool.query(query,providerData);
        return row;
    } catch (error) {
        throw error;
    }

}



async function getServiceProvider(condition,limit,offSet){

    let sqlQuery = `SELECT name,phone_number,service_type,profile_image FROM ${serviceTable.service_provider} WHERE status=? ` ;

    
  const params = ['approved'];
  //adding search conditon on query
  for (let key of Object.keys(condition)) {
    if (condition[key]) {
      // adding search conditon and  push value in params array;
      sqlQuery += ` AND ${key} = ?`;
      params.push(condition[key]);
    }
  }

  //after adding search condition query

  sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`;
  console.log(sqlQuery)

  try {
    const [result, field] = await pool.query(sqlQuery, params);

    return result;
  } catch (error) {
    throw error;
  }
}

async function getPendingServiceProvider(condition,limit,offSet){
  let sqlQuery = `SELECT * FROM ${serviceTable.service_provider} WHERE status=? ` ;

    
  const params = ['pending'];
  //adding search condition on query
  for (let key of Object.keys(condition)) {
    if (condition[key]) {
      // adding search condition and  push value in params array;
      sqlQuery += ` AND ${key} = ?`;
      params.push(condition[key]);
    }
  }

  //after adding search condition query

  sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`;
  console.log(sqlQuery)

  try {
    const [result, field] = await pool.query(sqlQuery, params);

    return result;
  } catch (error) {
    throw error;
  }
}


async function serviceProviderRating(rating,service_provider_id){


    let sqlQuery = ``

}




async function verifyServiceProvider(status,service_provider_id){
    let sqlQuery ;
    const params = [];
    if(status==='approved'){
      sqlQuery=`UPDATE ${serviceTable.service_provider} SET status=? WHERE provider_id = ? `;
      params.push(status,service_provider_id);
    }else if(status ==='rejected'){
      sqlQuery = `DELETE FROM ${serviceTable.service_provider} WHERE provider_id = ?`;
      params.push(service_provider_id)
    }
    

    try {
        const [response,field] = await pool.query(sqlQuery,params)
        return response;

    } catch (error) {
        throw error;
    }
}










module.exports = {serviceProviderModel,serviceProviderRatingModel,registerServiceProvider,getServiceProvider,verifyServiceProvider,getPendingServiceProvider}