const db = require('../../model.index');

const User = db.UserModel.User;



async function registerCustomer(data){
    console.log(data)
    return await User.create({
        user_type:"customer",
        name:data.name,
        email:data.email,
        phone_number:data.phone_number,
        password:data.password
    });
}


async function findCustomer(email){
    return  await User.findOne({
        where:{email:email},
        attributes:[['user_id','id'],'name','email','password']
    });
   
}

async function findCustomerPassword(id){
    return await User.findOne({
        where:{
            agent_id:id
        },
        attributes:['password']
    })
}

async function getCustomer(id){
    return  await User.findByPk(id);
}
async function getCustomerProfile(id) {
    try {
        const result = await UserAccount.findOne({
            where: {
                user_id: id,
                user_type: "customer"
            },
            include: [{
                model: db.UserModel.CustomerProfile,
                as: 'customerProfile',
                
            }],
            attributes: [
                'name',
                'email',
                'phone_number',
                
            ],
            raw: true,
            nest: true,
            subQuery: false,
        });

        return result;
    } catch (error) {
        console.error("Error in getCustomerProfile:", error);
        throw error; // Re-throw the error for further handling
    }
}




async function updateCustomerProfile(id){
    
}




module.exports ={registerCustomer,findCustomer,findCustomerPassword,getCustomer,getCustomerProfile};


