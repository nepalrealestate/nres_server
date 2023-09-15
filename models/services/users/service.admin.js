const db = require("../../model.index");

const Admin = db.UserModel.Admin;


async function registerAdmin(admin_type,name,email,password){
    return await Admin.create({
        admin_type:admin_type,
        name:name,
        email:email,
        password:password
    })
}


async function findAdmin(email,admin_type){
    return await Admin.findOne({
        where:{email:email,admin_type:admin_type},
        attributes:[['admin_id','id'],'admin_type','name','email','password'],
        raw:true
    },
    )
}

module.exports = {
    registerAdmin,findAdmin
}