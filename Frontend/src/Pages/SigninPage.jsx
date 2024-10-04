import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaRegCircleCheck,
  FaRegCircleXmark,
} from "react-icons/fa6";
// import { createUser, isLoggedIn, isUsernameExist } from "../utils/userApis";
import { validate } from "email-validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../Utils/UserAuthApi";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!validate(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password !== cpassword) {
      toast.error("Passwords are not matching");
      return;
    }

    const user = {
      name: name ?? "User",
      email: email,
      pswd: password,
    };

    setIsSubmitting(true);
    const res = await createUser(user);
    setIsSubmitting(false);

    if (res.data.Result) {
      console.log(res);
      toast.success(res.data.Data);
      navigate("/login");
    } else {
      toast.error(res.data.Data);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="mainbody">
      <Link className="topbackbtn" to={"/"}>
        <FaArrowLeft /> Back to home
      </Link>
      <form onSubmit={handleSignin}>
        <label className="formheading">Create Account</label>
        <div className="formcontrols">
          <label>Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="inputfield"
            type="text"
            autoComplete={true}
            required={true}
            placeholder="Enter your name"
          />
        </div>
        <div className="formcontrols">
          <label>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="inputfield"
            type="email"
            autoComplete={true}
            required={true}
            placeholder="Enter your email address"
          />
        </div>
        <div className="formcontrols">
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            minLength={8}
            className="inputfield"
            type="password"
            required={true}
            placeholder="Enter your password"
          />
        </div>
        <div className="formcontrols">
          <label>Confirm Password</label>
          <input
            onChange={(e) => setCpassword(e.target.value)}
            value={cpassword}
            minLength={8}
            className="inputfield"
            type="password"
            required={true}
            placeholder="Enter your password"
          />
        </div>
        <button className="loginbtn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <PulseLoader color="white" size={10} /> : "Signin"}
        </button>
        <span className="centertext"><Link className="linkbtn" to={"/login"}>Already have an account?</Link></span>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default SigninPage;
