const db = require("../../model.index");

const User = db.UserModel.User;

async function registerUser(data,options={}){

    const user =  await User.create({
        user_type:data.user_type,
        name:data.name,
        email:data.email,
        phone_number:data.phone_number,
        password:data.password
    },options)
    if(user){
        user.id = user.user_id;
        
    }
    
    return user;
}



async function getUser(user_type){
    return await User.findAll({
        where:{user_type:user_type},
        attributes:['user_id','name','email','phone_number']
    })
}



async function findUserByEmail(user_type='customer',email){
    return await User.findOne({
        where:{user_type:user_type,email:email},
        attributes:[['user_id','id'],'user_type','name','email','password'],
    })
}

// first object where condition - second attributes array
async function findUserByID(user_type='customer',id,attributes=null){
    return await User.findOne({
        where:{user_type:user_type,user_id:id},
        attributes:attributes
    })
}

async function deleteUser(user_id){
    return await User.destroy({
        where:{user_id:user_id}
    })
}

async function getBuyer(condition,attributes=null){
    return await User.findAll({
        where:condition,
        attributes:attributes,
        include:[{
            model:db.PropertyModel.RequestedProperty,
            required:true,
            attributes:['property_type']
            
        }]
    })  
}
async function getBuyerByID(user_id){
    return await User.findOne({
        where:{user_id:user_id},
        attributes:['user_id','name','email','phone_number'],
        include:[{
            model:db.PropertyModel.RequestedProperty,
            required:true,
            //attributes:['property_type']
            
        }]
    })
}

async function getSeller(condition){
    return await User.findAll({
       where:condition,
       include:[{
        model:db.Views.PropertyViewClient,
        required:true,
        attributes:['property_type']
    }]
    })
}

async function getSellerByID(user_id){
    return await User.findOne({
        where:{user_id:user_id},
        attributes:['user_id','name','email','phone_number'],
        include:[{
            model:db.Views.PropertyViewClient,
            required:true,
            attributes:['property_type','property_id','listed_for','price','province','district','municipality','area_name']
            
        }]
    })
}


async function updateCustomerPassword(user_id,hashPassword){
    return await User.update({password:hashPassword},{
        where:{user_type:"customer",user_id:user_id}
    })
}

async function updateAgentPassword(agent_id,hashPassword){
    return await User.update({password:hashPassword},{
        where:{user_type:"agent",user_id:agent_id}
    })
}






module.exports ={registerUser,
    findUserByEmail,
    findUserByID,
    getUser,
    getBuyer,
    getSeller,
    getSellerByID,
    updateCustomerPassword,
    updateAgentPassword
}