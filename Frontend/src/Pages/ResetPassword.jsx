import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button, Form, Input, message } from "antd";
import { validate } from "email-validator";
import { PulseLoader } from "react-spinners";
import { resetPassword } from "../Utils/UserAuthApi";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    if (password !== confirmPassword) {
      messageApi.warning("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    messageApi.open({
      type: "loading",
      content: "Resetting password..",
      duration: 0,
    });
    const res = await resetPassword(token, password);
    setIsSubmitting(false);
    messageApi.destroy();
    if (res.data.Result) {
      messageApi.success(res.data.Data);
      navigate("/login");
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
          onSubmit={handleResetPassword}
          onFinish={handleResetPassword}
          className="flex flex-col min-w-[350px] gap-0 p-[20px] rounded-xl md:shadow-lg bg-white"
        >
          <label className="text-center font-bold text-3xl mb-4">
            Reset Password
          </label>
          <label>New Password</label>
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
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              size="large"
              variant="filled"
              placeholder="Enter your password"
              autoComplete="new-password"
              allowClear
            />
          </Form.Item>
          <label>Confirm New Password</label>
          <Form.Item
            name="confirmpassword"
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              size="large"
              variant="filled"
              placeholder="Confirm your new password"
              autoComplete="new-password"
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
              "Reset Password"
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

export default ResetPassword;
