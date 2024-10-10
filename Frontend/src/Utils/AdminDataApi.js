import axios from "axios";
import {
  refreshAccessToken,
  isTokenExpired,
  decodeJWT,
} from "./UserAuthApi.js";

const addcategory = async (name) => {
  let token = localStorage.getItem("accessToken");
  console.log(decodeJWT(token));
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
    .post(
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
    .post(
      import.meta.env.VITE_BACKEND_URL + "admin/deletecategory",
      {
        catId: catid,
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

const getallbooks = async (name) => {
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

const getBookDetails = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/getbookdetails/"+id, {
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
}

const getLatestBookDetails = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/getlatestbookdetails", {
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
}

const getCategoryWiseBooks = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  let res;
  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "admin/getcategorywisebooks", {
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
}

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
    .post(import.meta.env.VITE_BACKEND_URL + "admin/updatebook/"+id, data, {
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
    .post(
      import.meta.env.VITE_BACKEND_URL + "admin/deletebook",
      {
        bookId: bookId,
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

const getallUsers = async (name) => {
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

export {
  addcategory,
  deletecategory,
  updatecategory,
  getcategory,
  addBook,
  getallbooks,
  getBookDetails,
  getLatestBookDetails,
  getCategoryWiseBooks,
  updateBook,
  deleteBook,
  getallUsers
};
