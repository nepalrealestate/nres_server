const db = require("../../model.index");

const Admin = db.UserModel.Admin;
const StaffProfile = db.UserModel.StaffProfile;



async function registerAdmin(admin_type,name,email,password,options ={}){
    return await Admin.create({
        admin_type:admin_type,
        name:name,
        email:email,
        password:password
    },options)
}

async function insertStaffProfile(staffProfile,options={}){
    return await StaffProfile.create(staffProfile,options);
}


async function findAdmin(email,admin_type){
    const data=  await Admin.findOne({
        where:{email:email,admin_type:admin_type},
        attributes:[['admin_id','id'],'admin_type','name','email','password'],
        
    },
    )
    return data?data.dataValues:data;
}

async function findAdminByID(admin_id,attributes=null){
    return await Admin.findOne({
        where:{admin_id:admin_id},
        attributes:attributes
    })
}

async function deleteAdmin(admin_id){
    return await Admin.destroy({
        where:{admin_id:admin_id,admin_type:"staff"},
    })
}


async function updateStaffPassword(admin_id,hashPassword){
    return await Admin.update({password:hashPassword},{
        where:{admin_type:"staff",admin_id:admin_id}
    })
}


async function updateSuperAdminPassword(admin_id,hashPassword){
    return await Admin.update({password:hashPassword},{
        where:{admin_type:"superAdmin",admin_id:admin_id}
    })
}
module.exports = {
    registerAdmin,
    insertStaffProfile,
    findAdmin,
    findAdminByID,
    deleteAdmin,
    updateStaffPassword,
    updateSuperAdminPassword,
}