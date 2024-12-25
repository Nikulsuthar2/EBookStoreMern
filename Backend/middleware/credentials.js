import allowedOrigin from "../config/allowedOrigin.js";

const credentials = (req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;
    if(allowedOrigin.includes(origin)){
        res.header("Access-Control-Allow-Credentials",true)
        next();
    } else {
        res.status(403).send('Access Denied: Unauthorized Origin');
    }
}

export default credentials;