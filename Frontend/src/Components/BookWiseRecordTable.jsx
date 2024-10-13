import { Table } from "antd";
import React from "react";

const BookWiseRecordTable = ({ bookWiseData }) => {
  const columns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      key: "sno",
      align: "center",
      render: (text, rec, idx) => idx + 1,
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      render: (img, rec) => (
        <img
          src={import.meta.env.VITE_BACKEND_URL + img}
          className="w-[50px] aspect-[3/4] m-auto object-cover rounded-md shadow-md"
        />
      ),
    },
    {
      title: "Book ID",
      dataIndex: "bookId",
      key: "bookId",
    },
    {
      title: "Book Title",
      dataIndex: "bookTitle",
      key: "bookTitle",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text, rec) => (
        <div className="font-semibold text-green-600">&#8377;{text}</div>
      ),
    },
    {
      title: "Total Sales",
      dataIndex: "salesCount",
      key: "salesCount",
      align: "center",
    },
    {
      title: "Total Earning",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      render: (text, rec) => (
        <div className="font-semibold text-green-600">&#8377;{text}</div>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={bookWiseData ? bookWiseData : []}
      rowKey="_id"
      size="small"
      scroll={{ x: "max-content" }}
    />
  );
};

export default BookWiseRecordTable;
