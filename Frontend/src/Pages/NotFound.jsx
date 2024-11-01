import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = ({ navigate }) => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are looking for does not exist."
      extra={
        <Link to={navigate ?? "/"}>
          <Button type="primary">Back to Home</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
