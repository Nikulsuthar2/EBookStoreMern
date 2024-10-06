import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validate } from "email-validator";
import { PulseLoader } from "react-spinners";
import { decodeJWT, isLoggedIn, loginUser } from "../Utils/UserAuthApi";
import { FaArrowLeft } from "react-icons/fa6";
import { Button, Form, Input, message} from "antd";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    //e.preventDefault();
    if (!validate(email)) {
      messageApi.warning("Please enter a valid email address");
      return;
    }
    const user = {
      email: email,
      pswd: password,
    };

    setIsSubmitting(true);
    messageApi.open({
      type: 'loading',
      content: 'Logging in..',
      duration: 0,
    });
    const res = await loginUser(user);
    setIsSubmitting(false);
    messageApi.destroy();
    if (res.data.Result) {
      messageApi.success("Account Created")
      const token = res.data.token;
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("userInfo", decodeJWT(token).UserInfo);
      if(decodeJWT(token).UserInfo.role === 1){
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } else {
      messageApi.error(res.data.Data);
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
    <div className="h-screen">
      {contextHolder}
      <div className="absolute top-0 w-full bg-white flex items-center gap-2 font-bold p-[10px] border-b-[1px] border-b-[#bdbdbd]">
        <Button type="primary" size="large" icon={<FaArrowLeft />} onClick={()=>navigate("/")}></Button>
        <span >Back to home</span>
      </div>
      <div className="h-full pt-10 flex justify-center items-center">
        <Form onSubmit={handleLogin} onFinish={handleLogin} className="flex flex-col min-w-[350px] gap-0 p-[20px] rounded-xl md:shadow-lg">
          <label className="text-center font-bold text-3xl mb-4">Login</label>
          <label>Email Address</label>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message:'Please enter a valid email'
              }
            ]}
          >
            <Input type="email" onChange={(e) => setEmail(e.target.value)} value={email} size="large" variant="filled" placeholder="Enter your email" allowClear/>
          </Form.Item>
          <label>Password</label>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                type: 'string',
                min: 8,
                max: 16
              },
            ]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)} value={password} size="large" variant="filled" placeholder="Enter your password" allowClear />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large" disabled={isSubmitting}>
            {isSubmitting ? <PulseLoader color="black" size={10} /> : "Login"}
          </Button>
          <span className="text-center">
            <Button htmlType="button" type="link" size="large" onClick={()=>navigate("/signin")}>
              Don't have an account?
            </Button>
          </span>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
