
// --- sequlize
function agentModel (sequelize,DataTypes){
  return Agent = sequelize.define('user_agent',{
    agent_id :{
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
    identification_type:{
      type:DataTypes.STRING
    },
    identification_number:{
      type:DataTypes.STRING
    },
    image:{
      type:DataTypes.JSON
    },
    password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate: {
        notEmpty: true  
    }
    },
    status:{
      type:DataTypes.ENUM('pending','approved','rejected'),
      defaultValue:'pending'
    }



  })
}


// // old code --------inserting 

// async function registerAgent(values) {
  

//   const insertQuery = `INSERT INTO ${userTable.agent} (name,email,phone_number,identification_type,identification_number,image,password) VALUES (?,?,?,?,?,?,?)`;
//   try {
//     const [result, field] = await pool.query(insertQuery,values);
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }







// // -------insert data ----------------




// //---------------------------Get Data---------------------

// async function findAgent(email) {
//   const findQuery = ` SELECT  * FROM ${userTable.agent} WHERE email=? `;
//   try {
//     const [row, field] = await pool.query(findQuery, [email]);
//     return row[0]; //this return only object no object inside array
//   } catch (error) {
//     throw error;
//   }
// }

// async function findAgentPassword(id){
//   const findQuery = ` SELECT  password FROM ${userTable.agent} WHERE id=? `;
//   try {
//     const [row, field] = await pool.query(findQuery, [id]);
//     return row[0]; 
//   } catch (error) {
//     throw error;
//   }
// }

// // return all agent data include - rating , total property except password
// async function getAgent(id){

//   const getQuery  = `SELECT a.name, a.email, a.phone_number,  ROUND(AVG(r.rating), 1) AS rating,
//   COUNT(r.rating) AS rating_count
//   FROM ${userTable.agent} AS a 
//   LEFT JOIN ${userTable.agentRating} AS r 
//   ON a.id = r.agent_id 
//   WHERE a.id = ? 
//   GROUP BY a.name, a.email, a.phone_number
//  `;

 

//   try {
//     const [result,field] = await pool.query(getQuery,[id]);
//     console.log(result[0])
//     return result[0];
//   } catch (error) {
//     throw error;
//   }

// }



// // ---------------------------Update Data--------------------------
// async function updateAgentPassword(id, hashPassword) {
//   const updateQuery = `UPDATE ${userTable.agent} SET password='${hashPassword}' WHERE id=${id}`;
//   try {
//     return await pool.query(updateQuery,[hashPassword,id]);
//   } catch (error) {
//     throw error;
//   }
// }


// async function updateAgentProfile(id,updateData){

//   let sqlQuery = `UPDATE ${userTable.agent} SET `

//   const params = [];

  

//   //update image
//   if(updateData['profile']){
//     sqlQuery += ` image= JSON_SET (image,'$.profile','${updateData['profile']}' )`
//     delete updateData.profile;
//   }


//   //adding upate data
//   for(let key of Object.keys(updateData)){
   
//     if(updateData[key]){
//       sqlQuery += ` ${key}=?,`
//       params.push(updateData[key]);
//     }
//   }
//   // after update remove comma if present
//   sqlQuery = sqlQuery.endsWith(",") ? sqlQuery.slice(0, -1) : sqlQuery;
//   sqlQuery += ` WHERE id = ?`;
//   params.push(id);

//   try {
//     console.log(sqlQuery)
//     return await pool.query(sqlQuery,params);
//   } catch (error) {
//     throw error;
//   }


// }




// async function getAllAgent(condition,limit,offSet){

//     let sqlQuery = `SELECT id, name, email, phone_number, identification_type, 
//     identification_number, image, status FROM ${userTable.agent} WHERE 1=1 `;


//     const params = [];

//     for(let key of Object.keys(condition)){

       

//       if(condition[key]){
//           // adding search conditon and  push value in params array;
//           sqlQuery += `AND ${key} = ?`
//           params.push(condition[key]);
//       }

//   }


//   sqlQuery += ` LIMIT ${limit} OFFSET ${offSet}`


  

//   try {
//       const [result,field] = await pool.query(sqlQuery,params);
    
//       return result;
//   } catch (error) {
//       console.log(error);
//       throw error;
//   }
// }


module.exports = {agentModel};
