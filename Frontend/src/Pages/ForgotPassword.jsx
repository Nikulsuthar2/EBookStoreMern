import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button, Form, Input, message } from "antd";
import { validate } from "email-validator";
import { PulseLoader } from "react-spinners";
import { requestPasswordReset } from "../Utils/UserAuthApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    //e.preventDefault();
    if (!validate(email)) {
      messageApi.warning("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    messageApi.open({
      type: "loading",
      content: "Sending email..",
      duration: 0,
    });
    const res = await requestPasswordReset(email);
    setIsSubmitting(false);
    messageApi.destroy();
    if (res.data.Result) {
      messageApi.success(res.data.Data);
    } else {
      messageApi.error(res.data.Data);
    }
  };
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
      <div className="h-full pt-10 flex justify-center items-center bg-gray-100">
        <Form
          onSubmit={handleForgotPassword}
          onFinish={handleForgotPassword}
          className="flex flex-col min-w-[350px] gap-0 p-[20px] rounded-xl md:shadow-lg bg-white"
        >
          <label className="text-center font-bold text-3xl mb-4">
            Forgot Password
          </label>
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
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <PulseLoader color="black" size={10} />
            ) : (
              "Send Reset Email"
            )}
          </Button>
          <span className="text-center">
            <Button
              htmlType="button"
              type="link"
              size="large"
              onClick={() => navigate("/login")}
            >
              Back to login
            </Button>
          </span>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
