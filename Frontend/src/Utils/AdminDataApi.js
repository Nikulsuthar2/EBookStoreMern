import axios from "axios";
import {
  refreshAccessToken,
  isTokenExpired,
  decodeJWT,
} from "./UserAuthApi.js";

const addcategory = async (name) => {
  let token = localStorage.getItem("accessToken");
  //console.log(decodeJWT(token));
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .post(
      import.meta.env.VITE_BACKEND_URL + "admin/addcategory",
      {
        category: name,
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

const updatecategory = async (catid, name) => {
  let token = localStorage.getItem("accessToken");
  console.log(decodeJWT(token));
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .put(
      import.meta.env.VITE_BACKEND_URL + "admin/updatecategory",
      {
        catId: catid,
        newName: name,
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

const deletecategory = async (catid) => {
  let token = localStorage.getItem("accessToken");
  console.log(decodeJWT(token));
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .delete(
      import.meta.env.VITE_BACKEND_URL + "admin/deletecategory/"+catid,
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

const getcategory = async (name) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/getcategory", {
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

const getallbooks = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/getallbooks", {
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

const addBook = async (data) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .post(import.meta.env.VITE_BACKEND_URL + "admin/addbook", data, {
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

const updateBook = async (id,data) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .put(import.meta.env.VITE_BACKEND_URL + "admin/updatebook/"+id, data, {
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

const deleteBook = async (bookId) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .delete(
      import.meta.env.VITE_BACKEND_URL + "admin/deletebook/"+bookId,
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

const getallUsers = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/getallusers", {
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

const getdashboardstats = async (name) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/dashboardstats", {
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

const getallPurchase = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/allpurchase", {
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

const getMonthlyPurchase = async (year, month) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/monthypurchase/"+year+"/"+month, {
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

const getYearlyPurchase = async (year) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/yearlypurchase/"+year, {
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

const getBookWisePurchase = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/bookwisepurchase/", {
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

const getBookWiseMonthlyPurchase = async (year, month) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/bookwisemonthypurchase/"+year+"/"+month, {
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

const getBookWiseYearlyPurchase = async (year) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/bookwiseyearlypurchase/"+year, {
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


export {
  addcategory,
  deletecategory,
  updatecategory,
  getcategory,
  addBook,
  getallbooks,
  updateBook,
  deleteBook,
  getallUsers,
  getdashboardstats,
  getallPurchase,
  getMonthlyPurchase,
  getYearlyPurchase,
  getBookWisePurchase,
  getBookWiseMonthlyPurchase,
  getBookWiseYearlyPurchase,
};
