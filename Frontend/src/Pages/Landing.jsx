import React from "react";
import { Link } from "react-router-dom";
import '../CSS/landing.css';
import book from '../assets/book2.png'

const Landing = () => {
  return (
    <div className="mainbody-center">
      <p className="logo-topleft">E-Book Store</p>
      <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
        <p className="landing-text">
          <span>Unlock Your</span>
          <span>Imagination With</span>
          <span style={{color:"#ff2a2a"}}>Our Ebooks</span>
        </p>
        <div style={{display:"flex",gap:"10px"}}>
          <Link className="secbtn" to={"/signin"}>Create Account</Link>
          <Link className="primarybtn" to={"/login"}>Login</Link>
        </div>
      </div>
      <img src={book} width={"40%"} />
    </div>
  );
};

export default Landing;
