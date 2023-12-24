const jwt = require('jsonwebtoken');
const S_key = process.env.JWT_SECRET_KEY;

const fetchUser = (req,res,next)=>{
    const token= req.header('auth-token');
    if(!token)
    { 
       return res.status(401).send({error:"please authenticate using a valid token"})
    }
    try{
        // jwt.verify returns payload object
        let string = jwt.verify(token,S_key);
        req.user=string;
        next();
    }
    catch(err)
    {
        res.status(401).send('failed to verify user');
    }
}
module.exports=fetchUser;