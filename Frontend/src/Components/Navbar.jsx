import { LogoutOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";
import { GiWhiteBook } from "react-icons/gi";
import { logoutUser } from "../Utils/UserAuthApi";
import { useNavigate } from "react-router-dom";



const Navbar = () => {

  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await logoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };
  return (
    <nav className="sticky top-0 w-full z-40 bg-white border-b-[1px] flex justify-between items-center backdrop-blur-md">
      <div className="demo-logo-vertical py-[5px] px-[10px] rounded-lg flex justify-center text-black bg-[#41414110] text-md items-center gap-2 font-bold">
        <GiWhiteBook size={20} color="#3ca3ff" />
        EBookstore
      </div>
      <div className="flex gap-1 items-center">
        <Input type="search" placeholder="Search Book here" className="w-fit" />
        <Button title="Search" type="primary">
          <SearchOutlined />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button title="Cart" type="text" shape="round" className="p-[15px]">
          <ShoppingCartOutlined /> Cart
        </Button>
        <Button title="Profile" type="text" shape="round" className="p-[15px]">
          <UserOutlined /> Profile
        </Button>
        <Button title="Search" onClick={handleLogout} shape="round" className="p-[15px]">
          <LogoutOutlined /> Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
