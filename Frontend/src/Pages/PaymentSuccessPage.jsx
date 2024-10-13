import React from "react";
import { Button, Result } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const {id, amount} = useParams(); 
  return (
    <div className="h-screen flex justify-center items-center">
    <Result
      status="success"
      title="Successfully Purchased Books"
      subTitle={`Order number: ${id} Total Amount Paid: ${amount}`}
      extra={[
        <Button type="primary" onClick={()=>navigate("/home")}>
          Go to Home
        </Button>
      ]}
    />
    </div>
  );
};

export default PaymentSuccessPage;
