const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

const googleSignInVerify = async(req,res,next)=>{
   console.log("googleSignInVerify")
   console.log(req.body)
    let token = req.body?.googleAccessToken;
    if(token){
        console.log("This is token",token);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        console.log(payload);
        const {name,email,picture} = payload;
    
        req.body = {
            name,
            email,
            picture
        }
    }
   
    next();
}


module.exports = {googleSignInVerify}

