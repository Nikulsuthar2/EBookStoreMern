import React, { useEffect } from "react";
import { decodeJWT, isLoggedIn } from "../Utils/UserAuthApi";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Navbar from "../Components/Navbar";

const HomeMaster = () => {
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
    <div className="h-screen overflow-hidden">
      <div>
        <Navbar />
        <Outlet />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default HomeMaster;
