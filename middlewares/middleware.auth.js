const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

const googleSignInVerify = async(req,res,next)=>{

    let token = req.body?.googleToken;
    if(!token){
        next();
    }
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const {name,email,picture} = payload;

    req.body = {
        name,
        email,
        picture
    },
    next();
}


module.exports = {googleSignInVerify}

