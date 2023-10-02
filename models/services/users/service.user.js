const db = require("../../model.index");

const User = db.UserModel.User;

async function registerUser(user_type,name,email,phone_number,password,options={}){

    const user =  await User.create({
        user_type:user_type,
        name:name,
        email:email,
        phone_number:phone_number,
        password:password
    },options)
    if(user){
        user.id = user.user_id;
        
    }
    
    return user;
}

async function insertUserProfile(userProfile,options={}){
    return await UserProfile
}

async function findUserByEmail(email){
    return await User.findOne({
        where:{email:email},
        attributes:[['user_id','id'],'user_type','name','email','password'],
    })
}

async function deleteUser(user_id,){
    return await User.destroy({
        where:{user_id:user_id}
    })
}


module.exports ={registerUser,findUserByEmail}