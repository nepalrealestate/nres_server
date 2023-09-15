const db = require("../../model.index");
const SuperAdmin = db.UserModel.SuperAdmin;
async function registerSuperAdmin(name,email,password){
    return await SuperAdmin.create({
        name:name,
        email:email,
        password:password
    })
}


async function findSuperAdmin(email){
    return await SuperAdmin.findOne({
        where:{email:email},
        attributes:[['superAdmin_id','id'],'name','email','password'],
        raw:true
    },
    )
}


module.exports = {registerSuperAdmin,findSuperAdmin}