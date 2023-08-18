const db  = require('../../model.index');
const Staff = db.UserModel.Staff


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

async function getStaff(id){
    return await Staff.findOne({
        where:{staff_id:id},
        attributes:{exclude: ['password']}
    })
}

async function updateStaffPassword(id,hashPassword){
    return await Staff.update({password:hashPassword},
        {
            where:{
                staff_id:id
            }
        })
}

module.exports = {registerStaff,findStaff,getStaff,updateStaffPassword}