import React from "react";
import { Link, useNavigate } from "react-router-dom";
import book from '../assets/book2.png'
import books from '../assets/book1.jpg';
import {Button} from 'antd'
import {GiBookCover, GiWhiteBook} from 'react-icons/gi'
const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen">
      <div className="bg-white absolute w-full top-0 flex justify-center items-center px-[100px] py-[20px] font-bold border-b-[1px] border-[#bdbdbd]">
        <div className="flex gap-2 items-center text-xl"><GiWhiteBook /> E-Book Store</div>
      </div>
      <div className={`h-full flex justify-center items-center px-[100px] bg-[url('src/assets/bookbg2.jpg')] bg-cover`}>
        <div className="backdrop-blur-md flex flex-col items-center gap-10 rounded-3xl p-4 bg-[#8f8f8f08] border-[1px] border-[#bdbdbd]">
          <img src={book}  className="w-[200px]" />
          <p className="text-7xl flex flex-col gap-3 items-center font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-red-500 bg-clip-text text-transparent">
            <span className="text-center">Read your favorite</span>
            <span>books</span>
          </p>
          <div className="flex gap-[10px]">
            <Button className="font-bold" size="large" onClick={()=>navigate("/signin")}>Create Account</Button>
            <Button className="font-bold" size="large" type="primary" onClick={()=>navigate("/login")}>Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
