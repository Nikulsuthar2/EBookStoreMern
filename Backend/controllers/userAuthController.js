import bcrypt from 'bcrypt'
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';


const handleNewUser = async (req, res) => {
    const {email, name, pswd, role} = req.body;
    if(!name || !email || !pswd) return res.status(400).json({"Result":false,"Data":"Name, email and password are required"});
    
    //check for already exist
    const duplicate = await User.findOne({email}).exec();
    if(duplicate) return res.status(409).json({"Result":false,"Data":"Email already exist"}); //conflict

    try {
        // encrypt the password
        const hashedPWD = await bcrypt.hash(pswd, 10);

        // store new user
        const newUser = {
            "name":name,
            "email": email,
            "password":hashedPWD,
            "role": role ?? 0
        };
        
        const result = await User.create(newUser);
        await result.save();

        res.status(201).json({"Result":true,"Data":"New User Created"});//"token":accessToken
    } catch (err) {
        console.log(err)
        res.status(500).json({"Result":false,"Data":err.message});
    }   
}


const handleLogin = async (req, res) => {
    const {email, pswd} = req.body;
    if(!email || !pswd) return res.status(400).json({"Result":false,"Data":"Email and password are required"});
    
    const foundUser = await User.findOne({email}).exec();
    if(!foundUser) return res.status(401).json({"Result":false, "Data":"User not exist"});

    const match = await bcrypt.compare(pswd, foundUser.password);
    if(match){
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "id":foundUser._id,
                    "username": foundUser.name,
                    "role": foundUser.role,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '120s'}
        );
        const refreshToken = jwt.sign(
            {"name": foundUser.name, "id": foundUser._id, "role": foundUser.role},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        // saving refresh token with current user
        foundUser.refreshToken = refreshToken;

        await foundUser.save();

        res.cookie("jwt", refreshToken, {httpOnly:true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        res.json({"Result":true, "token": accessToken ,"Data":`User ${foundUser.name} is logged in`})
    } else {
        res.status(401).json({"Result":false, "Data":"Username or password are incorrect"});
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(204).json({"Data":"No jwt cookie found so Unauthorized"});
    const refreshToken1 = cookies.jwt;
    const foundUser = await User.findOne({refreshToken: refreshToken1}).exec();
    if(!foundUser) return res.sendStatus(403); //forbidden
    jwt.verify(
        refreshToken1,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.name !== decoded.name) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id":decoded.id,
                        "name": decoded.name,
                        "role": decoded.role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '300s'}
            );
            res.json({accessToken});
        }
    )
}

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken1 = cookies.jwt;

    const foundUser = await User.findOne({refreshToken: refreshToken1}).exec();
    if(!foundUser) {
        res.clearCookie('jwt',{httpOnly: true, sameSite:'None', secure: true});
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    foundUser.status = false;
    await foundUser.save();

    res.clearCookie('jwt',{httpOnly: true, sameSite:'None', secure: true});
    res.sendStatus(204);
}

export {handleNewUser, handleLogin, handleRefreshToken, handleLogout};