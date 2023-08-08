const db = require('../../model.index');
const Customer = db.UserModel.Customer;



async function registerCustomer(data){
    console.log(data)
    return await Customer.create({
        name:data.name,
        email:data.email,
        phone_number:data.phoneNumber,
        password:data.hashPassword
    });
}


async function findCustomer(email){
    const data = await Customer.findOne({
        where:{email:email},
        attributes:[['customer_id','id'],'name','email','password']
    });
    return data?data.get():data;
}

async function findCustomerPassword(id){
    return await Customer.findOne({
        where:{
            agent_id:id
        },
        attributes:['password']
    })
}

async function getCustomer(id){
    const data =  await Customer.findByPk(id);
    return data?data.get():data;
}




module.exports ={registerCustomer,findCustomer,findCustomerPassword,getCustomer};


