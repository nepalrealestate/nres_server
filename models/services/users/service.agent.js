const db = require('../../model.index');
const Agent = db.UserModel.Agent;

async function registerAgent(data){
    return await Agent.create({
        name:data.name,
        email:email,
        phone_number:data.phone_number,
        identification_type:data.identification_type,
        identification_number:data.identification_number,
        image:data.image,
        password:data.hashPassword
    })
}


module.exports ={registerAgent}