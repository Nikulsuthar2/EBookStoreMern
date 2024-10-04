import React, { useEffect } from "react";
import { decodeJWT, isLoggedIn } from "../Utils/UserAuthApi";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import AdminNavbar from "../Components/AdminNavbar";

const AdminMaster = () => {
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = decodeJWT(token);
    const isLogin = async () => {
      const res = await isLoggedIn(token);
      if (!res) {
        navigate("/login");
      }
    };
    isLogin();
  }, []);

  return (
    <div>
      <div style={{height:"100vh"}}>
        <AdminNavbar />
        <Outlet />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default AdminMaster