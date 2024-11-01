import { EyeOutlined, ReadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const MyBookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleRead = (bookId) => {
    navigate("/home/readbook/" + bookId);
  };

  return (
    <div
      className="relative flex-none flex flex-col gap-1 w-[180px] rounded-[15px]"
      key={book._id}
    >
      <img
        title={book.title}
        src={import.meta.env.VITE_BACKEND_URL + book.thumbnail}
        className="w-[180px] shadow-lg rounded-[10px] aspect-[2/3] object-cover cursor-pointer"
        onClick={() => handleRead(book._id)}
      />
      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
        {book.title}
      </span>
      <Button
        className="w-full"
        onClick={() => navigate("/home/book/" + book._id)}
      >
        <EyeOutlined /> View Details
      </Button>
    </div>
  );
};

export default MyBookCard;
