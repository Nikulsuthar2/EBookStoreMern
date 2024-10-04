import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validate } from "email-validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import { decodeJWT, isLoggedIn, loginUser } from "../Utils/UserAuthApi";
import '../CSS/loginsignin.css';
import { FaArrowLeft } from "react-icons/fa6";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const user = {
      email: email,
      pswd: password,
    };

    setIsSubmitting(true);
    const res = await loginUser(user);
    setIsSubmitting(false);

    if (res.data.Result) {
      toast.success(res.data.Data);
      const token = res.data.token;
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("userInfo", decodeJWT(token).UserInfo);
      if(decodeJWT(token).UserInfo.role === 1){
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } else {
      toast.error(res.data.Data);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const isLogin = async () => {
      const res = await isLoggedIn(token);
      if (res) {
        if(decodeJWT(token).UserInfo.role){
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    };
    isLogin();
  }, []);

  return (
    <div className="mainbody">
      <Link className="topbackbtn" to={"/"}><FaArrowLeft /> Back to home</Link>
      <form onSubmit={handleLogin}>
        <label className="formheading">Login</label>
        <div class="formcontrols">
          <label>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete="username"
            class="inputfield"
            type="email"
            required={true}
            placeholder="Enter your email address"
          />
        </div>
        <div class="formcontrols">
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            minLength={8}
            class="inputfield"
            autoComplete="current-password"
            type="password"
            required={true}
            placeholder="Enter your password"
          />
        </div>

        <button className="loginbtn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <PulseLoader color="white" size={10} /> : "Login"}
        </button>
        <span className="centertext"><Link className="linkbtn" to={"/signin"}>Don't have an account?</Link></span>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default LoginPage;
