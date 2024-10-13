import {
  BookOutlined,
  CreditCardOutlined,
  EditOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Button, Empty, Input, message, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { getMyDetails, getMyPurchaseData, updateMyDetails } from "../Utils/userDataApi";
import { validate } from "email-validator";
import BookCard from "../Components/BookCard";
import MyBookCard from "../Components/MyBookCard";
import { BiUser } from "react-icons/bi";
import { formatTimestamp } from "../Utils/format";

const UserProfilePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [myBooksData, setMyBooksData] = useState(null);
  const [myWishlistData, setMyWishlistData] = useState(null);
  const [myOrderData, setMyOrderData] = useState(null);

  const items = [
    {
      key: "1",
      label: "My Books",
      children: <MyBooksTab data={myBooksData} />,
      icon: <BookOutlined />,
    },
    {
      key: "2",
      label: "Wishlist",
      children: <MyWishlistTab data={myWishlistData} />,
      icon: <HeartOutlined />,
    },
    {
      key: "3",
      label: "My Orders",
      children: <MyOrdersTab data={myOrderData}/>,
      icon: <CreditCardOutlined />,
    },
  ];

  const handleupdateMyDetails = async () => {
    console.log(name, email);
    if (name == "" || email == "") {
      messageApi.warning("Both name & email are required");
      return;
    }
    if (validate(email)) {
      const res = await updateMyDetails(name, email);
      if (res) {
        console.log(res.data);
        messageApi.success(res.data.Data);
        setIsEditMode(false);
      }
    } else {
      messageApi.warning("Please enter a valid email");
    }
  };

  const handleGetMyDetails = async () => {
    const res = await getMyDetails();
    if (res) {
      console.log(res.data);
      setName(res.data.Data.name);
      setEmail(res.data.Data.email);
      setUserData(res.data.Data);
      setMyBooksData(res.data.Data.mybooks);
      setMyWishlistData(res.data.Data.wishlist);
    }
  };

  const handleGetMyPurchaseData = async () => {
    const res = await getMyPurchaseData();
    if(res){
        console.log(res.data);
        setMyOrderData(res.data.Data);
    }
  }

  useEffect(() => {
    handleGetMyDetails();
    handleGetMyPurchaseData();
  }, []);

  return (
    <div className="px-4 lg:px-[100px] md:px-[100px] h-full bg-slate-50 overflow-auto">
      {contextHolder}
      <div className="py-4 flex items-center gap-4 mb-2">
        <Button
          size="large"
          shape="round"
          icon={<FaArrowLeft />}
          onClick={() => history.back()}
        >
          Back
        </Button>
        <p className="font-bold text-3xl">User Profile</p>
      </div>
      <div className="flex flex-col lg:flex-row-reverse w-full gap-4 justify-between mb-[70px]">
        <div className="w-full md:w-[300px] flex flex-col gap-2">
          <p className="py-[12px] text-[14px] font-bold border-b-[1px] flex items-center gap-2">
            <BiUser /> User Details
          </p>
          <div className="w-full border-[1px] rounded-lg overflow-hidden">
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[30%] flex items-center p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Name
              </span>
              <span className="w-[70%] p-1 text-sm text-end bg-white">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditMode}
                />
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[30%] flex items-center p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Email
              </span>
              <span className="w-[70%] p-1 text-sm text-end bg-white">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditMode}
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex gap-1 w-full p-1 bg-white">
                {isEditMode ? (
                  <>
                    <Button
                      type="primary"
                      className="w-full"
                      icon={<EditOutlined />}
                      onClick={handleupdateMyDetails}
                    >
                      Update
                    </Button>
                    <Button className="" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

const MyBooksTab = ({ data }) => {
  return (
    <>
      {data && data.length > 0 ? (
        <div className="flex gap-4 flex-wrap">
          {data?.map((book, idx) => {
            return <MyBookCard key={idx} book={book} />;
          })}
        </div>
      ) : (
        <div className="w-full h-[60%] flex justify-center items-center">
          <Empty />
        </div>
      )}
    </>
  );
};

const MyWishlistTab = ({ data }) => {
  return (
    <>
      {data && data.length > 0 ? (
        <div className="flex gap-4 flex-wrap">
          {data?.map((book, idx) => {
            return <BookCard key={idx} book={book} />;
          })}
        </div>
      ) : (
        <div className="w-full h-[60%] flex justify-center items-center">
          <Empty />
        </div>
      )}
    </>
  );
};

const MyOrdersTab = ({data}) => {
  return (
    <Table
      columns={orderColumns}
      dataSource={data ? data : []}
      rowKey="_id"
      size="small"
      bordered
    />
  );
};

const orderColumns = [
  {
    title: "Order ID",
    dataIndex: "_id",
    key: "_id",
    align: "center",
  },
  {
    title: "Items",
    dataIndex: "items",
    key: "items",
    render: (item, rec) => <div className="flex flex-col gap-2">
        {item.map((el,idx)=><span key={idx} className="flex gap-1 font-semibold">
            <span>{idx+1}).</span><span>{el.bookId.title}</span>
        </span>)}
    </div>
    // render: (item, rec) => <div className="flex gap-2">
    //     {item.map(el=><img
    //         src={import.meta.env.VITE_BACKEND_URL + el.bookId.thumbnail}
    //         className="w-[50px] aspect-[3/4] object-cover rounded-md shadow-md"
    //       />)}
    // </div>
  },
  {
    title: "Total Items",
    dataIndex: "totalitems",
    key: "totalitems",
    align: "center",
    render: (_, rec) => rec.items.length,
  },
  {
    title: "Amount Paid",
    dataIndex: "totalAmount",
    key: "totalAmount",
    align: "center",
    render: (text) => <span className="font-semibold text-red-500 flex items-center justify-center">&#8377;{text}</span>
  },
  {
    title: "Payment Date",
    dataIndex: "paymentDate",
    key: "paymentDate",
    align: "center",
    render: (text) => <div>{formatTimestamp(text).toUpperCase()}</div>,
  },
];
