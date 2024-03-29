
const db  = require('../../model.index');
const Admin = db.UserModel.Admin
const StaffProfile = db.UserModel.StaffProfile;



async function registerStaff(data){
    
    return await Staff.create(data) 
}

async function findStaff(email){
    const data= await Staff.findOne({
        where:{email:email},
        attributes:[['staff_id','id'],'name','email','password']
    })
    // if value present then result dataValues;
    return data?data.dataValues:data;
}

async function getStaffProfileByAdminID(admin_id){
    return await StaffProfile.findOne({
        where:{admin_id:admin_id}
    })
}
async function getStaffProfileByID(id){
    return await StaffProfile.findOne({
        where:{staff_id:id},
      //  attributes:{exclude: ['id']}
    })
}

async function getAllStaff(condition){
    const whereCondition = {};
    if(condition?.search){
        whereCondition.name={
            [db.Op.substring]:condition.search
        }
    }
    return await StaffProfile.findAll({
        where:whereCondition,
        //attributes: {exclude:['id']}
       
    });
}

// async function updateStaffPassword(id,hashPassword){
//     return await Staff.update({password:hashPassword},
//         {
//             where:{
//                 staff_id:id
//             }
//         })
// }

async function updateStaff(id,updateData,option={}){
    if(updateData.password)delete updateData.password;

    return await StaffProfile.update(updateData,{
        where:{staff_id:id}
    },option)
}

async function deleteStaff(id){
    return await StaffProfile.destroy({
        where:{staff_id:id}
    })
}





module.exports = {registerStaff,findStaff,getStaffProfileByID,getAllStaff,updateStaff,deleteStaff,getStaffProfileByAdminID}