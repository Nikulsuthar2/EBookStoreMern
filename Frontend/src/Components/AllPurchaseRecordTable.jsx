import React, { useState } from "react";
import { formatTimestamp } from "../Utils/format";
import { Button, Modal, Table } from "antd";

const AllPurchaseRecordTable = ({ purchaseData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelData, setModelData] = useState(null);

  const showModal = (data) => {
    setModelData(data);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      key: "sno",
      align: "center",
      render: (text, rec, idx) => idx + 1,
    },
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, rec) => <div>{rec.userId?.name}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, rec) => <div>{rec.userId?.email}</div>,
    },
    {
      title: "Total Items",
      dataIndex: "totalItems",
      key: "totalItems",
      align: "center",
      render: (_, rec) => <div>{rec.items.length}</div>,
    },
    {
      title: "Amount Paid",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      render: (text, rec) => (
        <div className="font-semibold text-green-600">&#8377;{text}</div>
      ),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      align: "center",
      render: (text) => <div>{formatTimestamp(text).toUpperCase()}</div>,
    },
    {
      title: "View Books",
      dataIndex: "bookspurchased",
      key: "bookspurchased",
      align: "center",
      render: (text, rec) => (
        <Button onClick={() => showModal(rec.items)}>View Books</Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={purchaseData ? purchaseData : []}
        rowKey="_id"
        size="small"
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Purchased Book"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modelData?.map((data, idx) => {
          return (
            <div key={idx} className="flex items-center gap-4 mb-2">
              <img
                src={import.meta.env.VITE_BACKEND_URL + data.bookId.thumbnail}
                className="w-[50px] aspect-[3/4] object-cover rounded-md shadow-md"
              />
              {idx + 1} {data.bookId.title}
            </div>
          );
        })}
      </Modal>
    </>
  );
};

export default AllPurchaseRecordTable;
