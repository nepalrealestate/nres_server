const {OAuth2Client} = require('google-auth-library');

const clientID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientID);

const googleSignInVerify = async(req,res,next)=>{
   console.log("googleSignInVerify")
   console.log(req.body)
   if(req.loginType === "google"){
        delete req.body?.googleAccessToken;
        delete req.loginType;
   }
    let token = req.body?.googleAccessToken;
    if(token){
        try {
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
            email
        }
        req.loginType = "google";
        } catch (error) {
            next(error)
        }
        
    }
   
    next();
}


module.exports = {googleSignInVerify}

