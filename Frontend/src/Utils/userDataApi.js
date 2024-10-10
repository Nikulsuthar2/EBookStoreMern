import axios from "axios";
import {
  refreshAccessToken,
  isTokenExpired,
  decodeJWT,
} from "./UserAuthApi.js";

const getCategoryWiseBooks = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "user/getcategorywisebooks", {
      headers: {
        Authorization: token,
      },
    })
    .then((resp) => {
      res = resp;
    })
    .catch((e) => {
      res = e.response;
    });
  return res;
};

const getBookDetails = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "user/getbookdetails/" + id, {
      headers: {
        Authorization: token,
      },
    })
    .then((resp) => {
      res = resp;
    })
    .catch((e) => {
      res = e.response;
    });
  return res;
};

const getLatestBookDetails = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "user/getlatestbookdetails", {
      headers: {
        Authorization: token,
      },
    })
    .then((resp) => {
      res = resp;
    })
    .catch((e) => {
      res = e.response;
    });
  return res;
};


export {getBookDetails, getCategoryWiseBooks, getLatestBookDetails}