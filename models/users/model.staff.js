const {pool}  = require("../../connection");
const {isTableExists} = require("../commonModels");
const { propertyTable, userTable } = require("../tableName");





function staffModel (sequelize,DataTypes){
    return Staff = sequelize.define('user_staff',{
      staff_id :{
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

      password:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
          notEmpty: true  
      }
    }
  
  
  
    })
  }




// async function registerStaff(name,email,password){
//         const insertQuery =  `INSERT INTO ${userTable.staff} (name,email,password) VALUES (?,?,?)`;
//         try {
//             const [result,field] = await pool.query(insertQuery,[name,email,password]);
//             return result;
//         } catch (error) {
//             console.log(error);
//             throw error;
//         }
//     }

  

// async function findStaff(email){
//     const findQuery = ` SELECT  * FROM ${userTable.staff} WHERE email=? `;
//     try {
//         const [row,field] =  await pool.query(findQuery,[email]);
//         return row[0];//this return only object no object inside array
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function getStaffByID(id){
//     const getQuery = `SELECT id,name,email FROM ${userTable.staff} WHERE id = ?`;


//     try {
//         const[result,field] = await pool.query(getQuery,[id]);
//         console.log(result[0])
//         return result[0];
//     } catch (error) {
//         throw error;
//     }
// }


async function insertStaffActivityLog(staffID,actionType,action){

    const insertQuery = `INSERT INTO ${userTable.staffActivityLog} (staff_id,action_type,action_description)  VALUES (?,?,?)`;

    try {
        const [response,field] = await pool.query(insertQuery,[staffID,actionType,action]);
        return response;
    } catch (error) {
        throw error;
    }

}

async function getStaffActivityLog(staffID){
    
    const getQuery = `SELECT * FROM ${userTable.staffActivityLog} WHERE staff_id = ?`;

    try {
        const [result,field]  = await pool.query(getQuery,[staffID]);
        return result;
    } catch (error) {
        throw error;
    }
}


module.exports = {staffModel, insertStaffActivityLog,getStaffActivityLog}
