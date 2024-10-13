import { LogoutOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import React, { useState } from "react";
import { GiWhiteBook } from "react-icons/gi";
import { logoutUser } from "../Utils/UserAuthApi";
import { Link, useNavigate } from "react-router-dom";



const Navbar = () => {
  const [searchbar, setSearchbar] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleSearch = async () => {
    if(searchbar !== ""){
      navigate("/home/searchbooks?query="+searchbar);
      setSearchbar("");
    }
  }

  const handleCategoryChange = () => {
    
  }

  return (
    <nav className="sticky top-0 w-full z-40 bg-white border-b-[1px] gap-2 flex flex-col md:flex-row justify-between items-center">
      <Link to={"/home"} className="demo-logo-vertical py-[5px] px-[10px] rounded-lg flex justify-center text-black bg-[#41414110] text-md items-center gap-2 font-bold">
        <GiWhiteBook size={20} color="#3ca3ff" />
        EBookstore
      </Link>
      <div className="flex gap-1 items-center">
        <Input type="search" value={searchbar} onChange={(e)=>setSearchbar(e.target.value)} placeholder="Search Book here" className="w-fit" />
        <Button title="Search" type="primary" onClick={handleSearch}>
          <SearchOutlined />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button onClick={()=>navigate("/home/cart/")} title="Cart" type="text" shape="round" className="p-[15px]">
          <ShoppingCartOutlined /> Cart
        </Button>
        <Button  onClick={()=>navigate("/home/profile/")} title="Profile" type="text" shape="round" className="p-[15px]">
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