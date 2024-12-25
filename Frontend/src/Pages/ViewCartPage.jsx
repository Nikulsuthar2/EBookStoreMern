import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRupeeSign, FaTrashCan } from "react-icons/fa6";
import {
  clearCart,
  getMyCart,
  purchaseBook,
  removeFromCart,
} from "../Utils/userDataApi";
import { useNavigate } from "react-router-dom";

const ViewCartPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [cartData, setCartData] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [netPrice, setNetPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cname, setCname] = useState("");
  const [cno, setCno] = useState("");
  const [cvv, setCVV] = useState("");

  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (cname == "" || cno == "" || cvv == "") {
      alert("Please enter details");
      return false;
    }
    if (cno.length != 16) {
      alert("Enter Valid Card Number");
      return false;
    }
    if (cvv.length != 3) {
      alert("Enter Valid CVV");
      return false;
    }
    handleCheckout();
    setCname("");
    setCno("");
    setCVV("");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setCname("");
    setCno("");
    setCVV("");
    setIsModalOpen(false);
  };

  const handleCheckout = async () => {
    const itemData = [];
    if (cartData.length > 0) {
      cartData.forEach((el) => {
        let temp = {};
        temp.bookId = el._id;
        temp.price = (el.price - (el.price * el.discount) / 100).toFixed(2);
        itemData.push(temp);
      });
      const res = await purchaseBook(itemData, netPrice);
      if (res) {
        navigate("/paymentsuccess/" + res.data.OrderId + "/" + netPrice);
      }
    }
    handleGetCartData();
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "key",
      key: "key",
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
          className="flex justify-center items-center"
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
      render: (text) => <span className="text-wrap">{text}</span>
    },
    {
      title: "Price",
      dataIndex: "finalprice",
      key: "finalprice",
      align: "center",
      render: (_, rec) => (
        <div className="text-green-400 font-bold flex justify-center items-center">
          {rec.price == 0 ? (
            "Free"
          ) : (
            <>&#8377;{(rec.price - (rec.price * rec.discount) / 100).toFixed(2)}</>
          )}
        </div>
      ),
    },
    {
      title: "Original Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text) => (
        <span className="text-green-400 font-bold flex justify-center items-center">
          {text == 0 ? "Free" : <>&#8377;{text}</>}
        </span>
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
      title: "Action",
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, rec) => (
        <Button onClick={() => handleRemoveFromCart(rec._id)}>Delete</Button>
      ),
    },
  ];

  const handleClearCart = async () => {
    const res = await clearCart();
    if (res) {
      //setCartData(null);
      handleGetCartData();
    }
  };

  const handleRemoveFromCart = async (bookid) => {
    const res = await removeFromCart(bookid);
    if (res) {
      setCartData(cartData.filter((data) => data._id != bookid));
      handleGetCartData();
    }
  };

  const handleGetCartData = async () => {
    const res = await getMyCart();
    if (res) {
      setCartData(res.data.Data);
    }
  };

  useEffect(() => {
    handleGetCartData();
  }, []);

  useEffect(() => {
    setTotalItems(cartData?.length);
    let count = 0;
    let discount = 0;
    cartData?.forEach((element) => {
      count += element.price;
      discount += (element.price * element.discount) / 100;
    });
    setTotalPrice(count);
    setTotalDiscount(discount);
    setNetPrice((count - discount).toFixed(2));
  }, [cartData]);

  return (
    <div className="px-4 lg:px-24 md:px-[50px] h-full bg-slate-50 overflow-auto">
      {contextHolder}
      <div className="py-4 flex items-center justify-between gap-4 mb-2">
        <div className="flex gap-4 items-center">
          <Button
            size="large"
            shape="round"
            icon={<FaArrowLeft />}
            onClick={() => history.back()}
          >
            Back
          </Button>
          <p className="font-bold text-3xl">My Cart</p>
        </div>
        <Button shape="round" size="large" onClick={handleClearCart}>
          <FaTrashCan /> Clear Cart
        </Button>
      </div>
      <div className="flex flex-col md:flex-col lg:flex-row sm:flex-col gap-[40px] mb-[150px] md:mb-[70px]">
        <Table
          columns={columns}
          dataSource={
            cartData
              ? cartData?.map((item) => ({ ...item, key: item._id }))
              : null
          }
          size="small"
          bordered
          className="w-full lg:w-[65%] "
          pagination={false}
          scroll={{ x: "max-content" }}
        />
        <div className="w-full md:w-[50%] lg:w-[35%] flex flex-col gap-4">
          <h1 className="text-xl font-bold">Order Summary</h1>
          <div className="w-full border-[1px] rounded-lg overflow-hidden">
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Total Items
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                {totalItems}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Original Price
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                &#8377;{totalPrice}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Discount
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white text-red-500">
                -&#8377;{totalDiscount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Net Price
              </span>
              <span className="w-[50%] p-2 text-sm text-end font-bold bg-white">
                &#8377;{netPrice}
              </span>
            </div>
          </div>
          {cartData?.length > 0 ? (
            <Button type="primary" onClick={showModal}>
              Checkout
            </Button>
          ) : (
            ""
          )}
        </div>
        <Modal
          title="Checkout"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p>Card Holder Name</p>
              <Input
                className="mb-2"
                placeholder="Enter Card Number"
                required
                onChange={(e) => setCname(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Card Number</p>
              <Input
                type="number"
                className="mb-2"
                placeholder="Enter Card Number"
                required
                minLength={16}
                maxLength={16}
                value={cno}
                onChange={(e) =>
                  setCno(e.target.value.length > 16 ? cno : e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>CVV</p>
              <Input
                type="number"
                value={cvv}
                onChange={(e) =>
                  setCVV(e.target.value > 999 ? cvv : e.target.value)
                }
                minLength={3}
                maxLength={3}
                placeholder="CVV"
                required
              />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ViewCartPage;
