import axios from 'axios';
import { refreshAccessToken, isTokenExpired } from './UserAuthApi.js';

const addcategory = async (name) => {
    let token = localStorage.getItem("accessToken");
    if (isTokenExpired(token)) refreshAccessToken();
    token = localStorage.getItem("accessToken");
    let res;
    await axios.post(
        import.meta.env.VITE_BACKEND_URL +"admin/addcategory", 
        {
            category:name
        },
        {
            headers: {
              Authorization: token,
            },
        }
    ).then(resp=>{
        res = resp;
    })
    .catch((e)=>{
        res = e.response
    });
    return res;
}

const getcategory = async (name) => {
    let token = localStorage.getItem("accessToken");
    if (isTokenExpired(token)) refreshAccessToken();
    token = localStorage.getItem("accessToken");
    let res;
    await axios.get(
        import.meta.env.VITE_BACKEND_URL +"admin/getcategory", 
        {
            headers: {
              Authorization: token,
            },
        }
    ).then(resp=>{
        res = resp;
    })
    .catch((e)=>{
        res = e.response
    });
    return res;
}

const getallbooks = async (name) => {
    let token = localStorage.getItem("accessToken");
    if (isTokenExpired(token)) refreshAccessToken();
    token = localStorage.getItem("accessToken");
    let res;
    await axios.get(
        import.meta.env.VITE_BACKEND_URL +"admin/getallbooks", 
        {
            headers: {
              Authorization: token,
            },
        }
    ).then(resp=>{
        res = resp;
    })
    .catch((e)=>{
        res = e.response
    });
    return res;
}



export {addcategory, getcategory, getallbooks};