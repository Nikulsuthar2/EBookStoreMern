import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../Utils/UserAuthApi";
import "./navstyle.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [active, setactive] = useState(0);

  let href = location.href;

  useEffect(() => {
    if (href.includes("/admin/ebooks")) {
      setactive(1);
    } else if (href.includes("/admin/category")) {
      setactive(2);
    } else if (href.includes("/admin/users")) {
      setactive(3);
    } else if (href.includes("/admin/report")) {
      setactive(4);
    } else {
      setactive(0);
    }
  }, [href]);

  const handleLogout = async () => {
    const res = await logoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav>
      <div className="nav-menu">
        <label className="Logo">E-Book Store</label>
        <Link
          to={"/admin/"}
          className={`nav-menu-btn ${active == 0 ? "active" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          to={"/admin/ebooks"}
          className={`nav-menu-btn ${active == 1 ? "active" : ""}`}
        >
          E-Books
        </Link>
        <Link
          to={"/admin/category"}
          className={`nav-menu-btn ${active == 2 ? "active" : ""}`}
        >
          Category
        </Link>
        <Link
          to={"/admin/users"}
          className={`nav-menu-btn ${active == 3 ? "active" : ""}`}
        >
          Users
        </Link>
        <Link
          to={"/admin/report"}
          className={`nav-menu-btn ${active == 4 ? "active" : ""}`}
        >
          Book Purchase report
        </Link>
      </div>

      <button className="logoutbtn" onClick={handleLogout}>
        LOG OUT
      </button>
    </nav>
  );
};

export default AdminNavbar;
