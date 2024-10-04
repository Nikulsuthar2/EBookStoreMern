import allowedOrigin from "./allowedOrigin.js";

const corsOptions = {
    origin: (origin, callback)=>{
        if(allowedOrigin.indexOf(origin) !== -1 || !origin)
            callback(null, true);
        else{
            callback(new Error("Not Allowed By CORS"));
        }
    },
    credentials:true,
    optionsSuccessStatus: 200
}

export default corsOptions;