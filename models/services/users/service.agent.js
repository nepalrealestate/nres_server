const { Sequelize } = require('sequelize');
const db = require('../../model.index');
const Agent = db.UserModel.Agent;

async function registerAgent(data){
    return await Agent.create({
        name:data.name,
        email:data.email,
        phone_number:data.phone_number,
        identification_type:data.identification_type,
        identification_number:data.identification_number,
        image:data.image,
        password:data.hashPassword
    })
}


async function findAgent(email){
    const data =  await Agent.findOne({
        where:{email:email},
        attributes:[['agent_id','id'],'name','email','password']
    });
    // if value present then result dataValues;
    return data?data.dataValues:data;
    
}


async function findAgentPassword(id){
    return await Agent.findOne({
        where:{
            agent_id:id
        },
        attributes:['password']
    })
}


//@note-  later return agent rating as well as

//return all agent include - rating, total property except password
async function getAgent(id){
    return await Agent.findOne({
        where:{agent_id:id},
        attributes: { exclude: ['password'] },
    })
}


async function getAllAgent(condition,limit,offSet){
    return await Agent.findAll({
        where:condition,
        attributes: ['agent_id', 'name', 'email', 'phone_number', 'identification_type', 'identification_number', 'image', 'status'],
        limit: limit,
        offset: offSet
    })
}




// ------------ Update Data---------------------

async function updateAgentProfile(id,updateData){

    if('password' in updateData){
        delete updateData.password;
    }

    //seprate profile from other update data
    let profileImage;
    if(updateData['profile']){
        profileImage = {image:Sequelize.fn('JSON_SET',Sequelize.col('image'),'$.profile',updateData['profile'])};
        delete updateData.profile;
    }

    return Agent.update({...updateData,...profileImage},{
        where:{
            agent_id:id
        }
    })

}

async function updateAgentPassword(id,hashPassword){
    return await Agent.update(
        {password:hashPassword},
        {
            where:{
                agent_id:id
            }
        }
    )
}


module.exports ={
    registerAgent,
    findAgent,
    findAgentPassword,
    getAgent,
    getAllAgent,
    updateAgentPassword,
    updateAgentProfile
}