import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCircleUser,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaUser,
  FaUserAstronaut,
} from "react-icons/fa6";
import { validate } from "email-validator";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../Utils/UserAuthApi";
import { Button, Input, Form, message } from "antd";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!validate(email)) {
      messageApi.warning("Please enter a valid email address");
      return;
    }
    if (password.length < 8 || password.length > 16) {
      messageApi.warning("Password length must be between 8 to 16");
      return;
    }
    if (password !== cpassword) {
      messageApi.error("Passwords are not matching");
      return;
    }

    const user = {
      name: name ?? "User",
      email: email,
      pswd: password,
    };

    setIsSubmitting(true);
    messageApi.open({
      type: "loading",
      content: "Creating Account..",
      duration: 0,
    });

    const res = await createUser(user);
    setIsSubmitting(false);
    messageApi.destroy();
    if (res.data.Result) {
      messageApi.success("Account Created");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      messageApi.error(res.data.Data);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="h-screen">
      {contextHolder}
      <div className="absolute top-0 w-full bg-white flex items-center gap-2 font-bold p-[10px] border-b-[1px] border-b-[#bdbdbd]">
        <Button
          type="primary"
          size="large"
          icon={<FaArrowLeft />}
          onClick={() => navigate("/")}
        ></Button>
        <span>Back to home</span>
      </div>
      <div className="h-full pt-10 flex justify-center items-center">
        <Form className="flex flex-col min-w-[350px] gap-0 p-[20px] rounded-xl md:shadow-lg">
          <label className="text-center font-bold text-3xl mb-4">
            Create Account
          </label>
          <label>Name</label>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              size="large"
              variant="filled"
              placeholder="Enter your name"
              allowClear
              required={true}
            />
          </Form.Item>
          <label>Email Address</label>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              size="large"
              variant="filled"
              placeholder="Enter your email"
              allowClear
            />
          </Form.Item>
          <label>Password</label>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                type: "string",
                min: 8,
                max: 16,
              },
            ]}
          >
            <Input.Password
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              size="large"
              variant="filled"
              placeholder="Enter your password"
              allowClear
              required={true}
            />
          </Form.Item>
          <label>Confirm Password</label>
          <Form.Item
            name="cofirm password"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              {
                type: "string",
                min: 8,
                max: 16,
              },
            ]}
          >
            <Input.Password
              onChange={(e) => setCpassword(e.target.value)}
              value={cpassword}
              size="large"
              variant="filled"
              placeholder="Confirm your password"
              allowClear
              required={true}
            />
          </Form.Item>
          <Button
            onClick={handleSignin}
            type="primary"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? <PulseLoader color="black" size={10} /> : "Signin"}
          </Button>
          <span className="text-center">
            <Button
              htmlType="button"
              type="link"
              size="large"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </Button>
          </span>
        </Form>
      </div>
    </div>
  );
};

export default SigninPage;
