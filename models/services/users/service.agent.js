
const db = require('../../model.index');

const User = db.UserModel.User;
const AgentRating = db.UserModel.AgentRating;
const AgentInfo = db.UserModel.AgentInfo


async function registerAgent(data){
    return await User.create({
        user_type:"agent",
        name:data.name,
        email:data.email,
        phone_number:data.phone_number,
        password:data.hashPassword
    })
}




async function findAgent(email){
    const data =  await User.findOne({
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
async function getAgentByID(id){
    return await User.findOne({
        where:{user_id:id,user_type:"agent"},
        attributes: { exclude: ['password'] },
        //include:{model:AgentInfo,as:'agentInfo'}
        
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

    return await Agent.update({...updateData,...profileImage},{
        where:{
            agent_id:id
        }
    })

}




async function insertAgentRating(agentRating,review,customer_id,agent_id) {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();

        await AgentRating.create({
            rating:agentRating,
            review:review,
            customer_id:customer_id,
            agent_id:agent_id
        },{ transaction: transaction });
        
        // update average rating and total rating in agent info table

        
        const ratingResult = await AgentRating.findAll({
            where: { agent_id: agent_id },
            attributes: [
              [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating'],
              [db.sequelize.fn('COUNT', db.sequelize.col('rating')), 'totalRating']
            ],
            raw: true,
           
        }, {transaction: transaction});

        

        const averageRating = ratingResult[0].averageRating;
        const totalRating = ratingResult[0].totalRating;
        console.log(averageRating, totalRating);

        // update
        await AgentInfo.upsert(
            { agent_id:agent_id,averageRating: averageRating, totalRating: totalRating },
            
            { transaction: transaction }
        );

        await transaction.commit();
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.log(error)
        throw error;
    }
}




module.exports ={
    registerAgent,
    findAgent,
    findAgentPassword,
    getAgentByID,
    getAllAgent,
    updateAgentProfile,
    insertAgentRating
}