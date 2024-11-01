import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteBook, getallbooks } from "../Utils/AdminDataApi";
import { Button, Table, Modal, Space, message, Input } from "antd";
import { FaPlus, FaTrash, FaTrashCan } from "react-icons/fa6";
import { MdRefresh } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { FaRupeeSign } from "react-icons/fa";

const BookListPage = () => {
  const [booklist, setBooklist] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = Modal;

  const navigate = useNavigate();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => <div>{text}</div>,
  });

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
        <a
          href={import.meta.env.VITE_BACKEND_URL + rec.bookurl}
          target="_blank"
        >
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
      fixed: "left",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps("title"),
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
        <div className="text-green-400 font-bold flex justify-center items-center">
          {text == 0 ? (
            "Free"
          ) : (
            <>
              <FaRupeeSign />
              {text}
            </>
          )}
        </div>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "center",
      render: (text) => (
        <div className="text-red-400 font-bold">
          {text == 0 ? "No" : text + "%"}
        </div>
      ),
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
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => navigate(`/admin/ebooks/updatebook/${record._id}`)}
          >
            Edit
          </Button>
          <Button
            color="danger"
            onClick={() => showConfirm(record._id, record.title)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeleteBook = async (id) => {
    messageApi.open({
      type: "loading",
      content: "Deleting Book..",
      duration: 0,
    });
    if (Array.isArray(id)) {
      let count = 0;
      id.forEach(async (el) => {
        const res = await deleteBook(el);
        if (res) {
          count++;
        }
        messageApi.destroy();
        if (count == id.length) {
          messageApi.success("Books deleted");
          handleGetAllBooks();
        } else {
          messageApi.error("Some books are not deleted");
        }
      });
      messageApi.destroy();
    } else {
      const res = await deleteBook(id);
      messageApi.destroy();
      if (res) {
        messageApi.success("Book deleted");
        handleGetAllBooks();
      }
    }
  };

  const showConfirm = (id, name) => {
    if (!id || id == "" || id.length == 0) {
      messageApi.info("Please select book to delete");
      return;
    }
    confirm({
      title: "Delete Book - " + name,
      icon: <ExclamationCircleFilled />,
      content: "Do you want to delete this book?",
      onOk() {
        handleDeleteBook(id);
      },
      onCancel() {
        console.log("Cancel deletion");
      },
    });
  };

  const showDeleteBtnConfirm = (ids) => {
    if (!ids || ids == "" || ids.length == 0) {
      messageApi.info("Please select book to delete");
      return;
    }
    confirm({
      title: "Delete Books",
      icon: <ExclamationCircleFilled />,
      content: "Do you want to delete this books?",
      onOk() {
        handleDeleteBook(ids);
      },
      onCancel() {
        console.log("Cancel deletion");
      },
    });
  };

  const handleGetAllBooks = async () => {
    messageApi.open({
      type: "loading",
      content: "Loading Books..",
      duration: 0,
    });
    const res = await getallbooks();
    messageApi.destroy();
    if (res) {
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
          <Button shape="circle" onClick={handleGetAllBooks}>
            <MdRefresh />
          </Button>
          <Button
            shape="circle"
            onClick={() => showDeleteBtnConfirm(selectedRowKeys)}
          >
            <FaTrashCan />
          </Button>
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
