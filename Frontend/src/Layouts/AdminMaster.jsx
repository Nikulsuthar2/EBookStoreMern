import React, { useEffect, useState } from "react";
import { decodeJWT, isLoggedIn, logoutUser } from "../Utils/UserAuthApi";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar";
import { Button, Layout, Menu, theme } from "antd";
import {GiBookCover, GiWhiteBook} from 'react-icons/gi'
import {
  DashboardOutlined,
  BookOutlined,
  UngroupOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { MdOutlineCategory } from 'react-icons/md';
const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Dashboard', '1', <DashboardOutlined />),
  getItem('Books', '2', <BookOutlined />),
  getItem('Category', '3', <UngroupOutlined />),
  getItem('Users', '4', <TeamOutlined />),
  getItem('Purchase Report', '5', <BarChartOutlined />),
  getItem('Logout', '6', <LogoutOutlined />),
];

const AdminMaster = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);

  let href = location.href;


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

  useEffect(()=>{
    if(href.includes("/admin/ebooks"))
      setSelectedKeys(["2"]);
    if(href.includes("/admin/category"))
      setSelectedKeys(["3"]);
    if(href.includes("/admin/users"))
      setSelectedKeys(["4"]);
    if(href.includes("/admin/purchasereport"))
      setSelectedKeys(["5"]);
  },[href])

  const navigateTo = (key) => {
    console.log(key)
    if(key == 1) {
      setSelectedKeys(["1"])
      navigate("/admin/")
    }
    else if(key == 2) {
      setSelectedKeys(["2"])
      navigate("/admin/ebooks");
    }
    else if(key == 3) {
      setSelectedKeys(["3"])
      navigate("/admin/category");
    }
    else if(key == 4) {
      setSelectedKeys(["4"])
      navigate("/admin/users");
    }
    else if(key == 5) {
      setSelectedKeys(["5"])
      navigate("/admin/purchasereport");
    }
    else if (key == 6) {
      handleLogout();
    }
  }

  const handleLogout = async () => {
    const res = await logoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };


  return (
    <div className="h-screen overflow-hidden">
      <Layout>
        <Sider
          breakpoint="md"
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="border-r-[1px] border-solid border-[#0505050f]"
        >
          <div className="demo-logo-vertical mt-4 m-4 p-[10px] rounded-lg flex justify-center text-black bg-[#41414110] text-md items-center gap-2 font-bold"><GiWhiteBook size={20} color="#3ca3ff" />{ collapsed ? "" : "E-BookStore"}</div>
          <Menu
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            onClick={(e)=>navigateTo(e.key)}
            selectedKeys={selectedKeys}
          />
        </Sider>
        <Outlet />
      </Layout>
    </div>
  );
};

export default AdminMaster;
