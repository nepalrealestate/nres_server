const {pool}  = require("../../connection");
const {isTableExists} = require("../commonModels");

const superAdminTableName = 'superAdmin';
const schemaName = 'nres_users';


function superAdminModel(sequelize,DataTypes){
    return SuperAdmin = sequelize.define('user_superAdmin',{
        superAdmin_id :{
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

    },{
      freezeTableName:true
    })
}





module.exports = {superAdminModel};