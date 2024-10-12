import axios from "axios";
import {
  refreshAccessToken,
  isTokenExpired,
  decodeJWT,
} from "./UserAuthApi.js";

const getCategoryWiseBooks = async () => {
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

const getCategoryBooks = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "user/getcategorybooks/" + id, {
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

const addToWishlist = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .post(
      import.meta.env.VITE_BACKEND_URL + "user/addtowishlist/" + id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((resp) => {
      res = resp;
    })
    .catch((e) => {
      res = e.response;
    });
  return res;
};

const removeFromWishlist = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .delete(
      import.meta.env.VITE_BACKEND_URL + "user/removefromwishlist/" + id,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((resp) => {
      res = resp;
    })
    .catch((e) => {
      res = e.response;
    });
  return res;
};

const addToCart = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .post(
      import.meta.env.VITE_BACKEND_URL + "user/addtocart/" + id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((resp) => {
      res = resp;
    })
    .catch((e) => {
      res = e.response;
    });
  return res;
};

const removeFromCart = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .delete(import.meta.env.VITE_BACKEND_URL + "user/removefromcart/" + id, {
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

const getBookSearchResult = async (query) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "user/searchbooks?query=" + query, {
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

const getMyCart = async (query) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "user/mycart", {
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

const purchaseBook = async (items, totalAmount) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .post(
      import.meta.env.VITE_BACKEND_URL + "user/purchasebooks/",
      {
        items: items,
        totalAmount: totalAmount,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((resp) => {
      res = resp;
    })
    .catch((e) => {
      res = e.response;
    });
  return res;
};

export {
  getBookDetails,
  getCategoryBooks,
  getCategoryWiseBooks,
  getLatestBookDetails,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
  getBookSearchResult,
  getMyCart,
  purchaseBook,
};
