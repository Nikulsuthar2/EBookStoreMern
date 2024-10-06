import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteBook, getallbooks } from "../Utils/AdminDataApi";
import { Button, Table, Modal, Space, message, Radio } from "antd";
import { FaPlus, FaTrash, FaTrashCan } from "react-icons/fa6";
import { MdRefresh } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";



const BookListPage = () => {
  const [booklist, setBooklist] = useState(null);
  const [isGrid, setIsGrid] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = Modal;

  const navigate = useNavigate();
  const columns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      key: "sno",
      render: (text, rec, idx) => idx + 1,
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      fixed: "left",
      render: (text, rec) => (
        <a href={import.meta.env.VITE_BACKEND_URL + rec.bookurl} target="_blank">
          <img
            src={import.meta.env.VITE_BACKEND_URL + text}
            className="w-[50px] aspect-[3/4] object-cover rounded-md shadow-md"
          />
        </a>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      fixed:'left',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      align: "center",
      key: "isbn",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text) => (
        <div className="text-green-400 font-bold">{"$" + text}</div>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "center",
      render: (text) => (<div className="text-red-400 font-bold">{text == 0 ? "No" : text + "%"}</div>),
    },
    {
      title: "Author",
      dataIndex: "author",
      align: "center",
      key: "author",
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      align: "center",
      key: "publisher",
    },
    {
      title: "Language",
      dataIndex: "language",
      align: "center",
      key: "language",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      fixed:'right',
      render: (_, record) => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button color="danger" onClick={()=>showConfirm(record._id,record.title)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleDeleteBook = async (id) => {
    messageApi.open({
      type: 'loading',
      content: 'Deleting Book..',
      duration: 0,
    });
    const res = await deleteBook(id);
    messageApi.destroy();
    if (res) {
      console.log(res.data.Data);
      handleGetAllBooks();
    }
  }
  
  const showConfirm = (id,name) => {
    confirm({
      title: 'Delete Book - '+ name,
      icon: <ExclamationCircleFilled />,
      content: 'Do you want to delete this book?',
      onOk() {
        handleDeleteBook(id);
      },
      onCancel() {
        console.log('Cancel deletion');
      },
    });
  };

  const handleGetAllBooks = async () => {
    messageApi.open({
      type: 'loading',
      content: 'Loading Books..',
      duration: 0,
    });
    const res = await getallbooks();
    messageApi.destroy();
    if (res) {
      console.log(res.data.Data);
      setBooklist(res.data.Data);
    }
  };

  useEffect(() => {
    handleGetAllBooks();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex font-bold text-2xl p-4 border-b-[1px] justify-between  sticky top-0 z-50">
        Manage E-Books
        <div className="flex gap-2">
          <Button shape="circle" type="primary" onClick={handleGetAllBooks}><MdRefresh/></Button>
          <Button shape="circle" onClick={handleGetAllBooks}><FaTrashCan/></Button>
          <Button onClick={() => navigate("/admin/category")}>
            Add Book Category
          </Button>
          <Button
            type="primary"
            onClick={() => navigate("/admin/ebooks/addBook")}
          >
            <FaPlus /> Add Book
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={booklist}
          rowKey="_id"
          size="small"
        />
      </div>
    </div>
  );
};

export default BookListPage;
