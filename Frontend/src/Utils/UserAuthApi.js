import axios from 'axios';

const createUser = async (user) => {
    let res;
    await axios.post(
        import.meta.env.VITE_BACKEND_URL +"auth/signin", 
        user
    ).then(resp=>{
        res = resp;
    })
    .catch((e)=>{
        res = e.response
    });
    return res;
}

const loginUser = async (user) => {
    let res;
    await axios.post(
        import.meta.env.VITE_BACKEND_URL +"auth/login", 
        user, 
        {
            'Content-Type': 'application/json',
            withCredentials: true,
        }
    ).then(resp=>{
        res = resp;
    })
    .catch((e)=>{
        res = e.response
    });
    return res;
}

const logoutUser = async () => {
    let res;
    await axios.post(import.meta.env.VITE_BACKEND_URL +"auth/logout",{},{withCredentials:true})
    .then(rs=>res=rs)
    .catch(error=> res = error);
    return res;
}


const decodeJWT = (token)=>{
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e){
        return null;
    }
}

const isTokenExpired = (token) => {
    const decoded = decodeJWT(token);
    if(decoded && decoded.exp){
        return decoded.exp * 1000 < Date.now();
    }
    return true;
}

const refreshAccessToken = async () => {
    await axios.post(import.meta.env.VITE_BACKEND_URL +"auth/refreshtoken",{},{withCredentials:true})
    .then(res=>{
        if(res.statusText === 'OK'){
            localStorage.setItem('accessToken',res.data.accessToken);
            return true;
        }
        return false;
    })
    .catch(error=>{
        return false;
    });
    return false;
}

const isLoggedIn = async (token) => {
    if(token && !isTokenExpired(token)){
        return true;
    } else if (token && isTokenExpired(token)) {
        await refreshAccessToken().then(success=>{
            return success;
        })
    }
    return false;
}

export {createUser, loginUser, logoutUser, decodeJWT, isTokenExpired, refreshAccessToken, isLoggedIn};