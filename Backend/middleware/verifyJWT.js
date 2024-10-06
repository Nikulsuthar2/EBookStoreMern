import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {
    let authHeader = req.headers["authorization"];
    if(!authHeader) return res.status(401).json({msg:"auth header not found"});
    if(authHeader.startsWith("Bearer")){
        authHeader = authHeader.split(" ")[1];
    }
    const token = authHeader;
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) console.log(err);
            if (err) return res.sendStatus(403); 
            //console.log(decoded)// forbidden
            req.user = decoded.UserInfo;
            next();
        }
    )
}

export default verifyJWT;