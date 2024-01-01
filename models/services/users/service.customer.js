const db = require('../../model.index');

const User = db.UserModel.User;
const CustomerProfile = db.UserModel.CustomerProfile;



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
        console.log("result", result);
         // Map properties from customerProfile to customer
         if (result?.customerProfile) {
            console.log("result.customerProfile", result.customerProfile)
            result.profile_image = result.customerProfile.profile_image;
            result.address = result.customerProfile.address;
            result.property_limit = result.customerProfile.property_limit;

            // Remove customerProfile from the result
            delete result.customerProfile;
        }
        return result;
    } catch (error) {
        console.error("Error in getCustomerProfile:", error);
        throw error; // Re-throw the error for further handling
    }
}




async function updateCustomerProfile(id,data){
    
    // if name or email , then update user_account
    // if profile_image or address or property_limit, then update customer_profile
    const {name,email,phone_number,profile_image,address,property_limit} = data;
    let result;
    console.log("data",data);
    console.log("id",id);
    
    let profile = {};
    if(name)profile.name = name;
    if(email)profile.email = email;
    if(phone_number)profile.phone_number = phone_number;
    let profileData = {};
    if(profile_image)profileData.profile_image = profile_image;
    if(address)profileData.address = address;
    if(property_limit)profileData.property_limit = property_limit;

    console.log("profile",profile);
    if(name || email || phone_number){
        result = await User.update(profile,{
            where:{user_id:id}
        })
    }
    if(profile_image || address || property_limit){
        result = await CustomerProfile.update(profileData,{
            where:{user_id:id}
        })
    }

    return result;
}




module.exports ={registerCustomer,findCustomer,findCustomerPassword,getCustomer,getCustomerProfile,updateCustomerProfile};


