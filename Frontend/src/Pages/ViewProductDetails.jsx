import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToWishlist,
  getBookDetails,
  removeFromCart,
  removeFromWishlist,
} from "../Utils/userDataApi";
import { Button, Descriptions } from "antd";
import { MdAddShoppingCart, MdRemoveShoppingCart } from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";
import { ReadOutlined } from "@ant-design/icons";
import { TbHeart, TbHeartFilled } from "react-icons/tb";
import { message } from "antd";
import "../assets/scrollbar.css";
import { FaArrowLeft } from "react-icons/fa6";

const ViewProductDetails = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);

  const navigate = useNavigate();

  const handleGetBookDetails = async (id) => {
    const res = await getBookDetails(id);
    if (res) {
      const data = res.data.Data;
      data.isInCart = res.data.isInCart;
      data.isInMybooks = res.data.isInMybooks;
      data.isInWishlist = res.data.isInWishlist;
      setBookData(data);
    }
  };

  const handleWishlist = async (id, isInWishlist) => {
    let res;
    if (isInWishlist) {
      res = await removeFromWishlist(id);
    } else {
      res = await addToWishlist(id);
    }
    if (res) {
      messageApi.success(res.data.Data);
      handleGetBookDetails(bookId);
    }
  };

  const handleCart = async (id, isInCart) => {
    let res;
    if (isInCart) {
      res = await removeFromCart(id);
    } else {
      res = await addToCart(id);
    }
    if (res) {
      messageApi.success(res.data.Data);
      handleGetBookDetails(id);
    }
  };

  const handleBuy = async () => {
    await handleCart(bookId, false);
    navigate("/home/cart/");
  };

  const handleRead = (bookId) => {
    navigate("/home/readbook/" + bookId);
  };

  useEffect(() => {
    handleGetBookDetails(bookId);
  }, []);

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 overflow-auto scrollbar-hide box-border px-0 lg:px-24">
      {contextHolder}
      <div className="relative md:sticky md:top-0 h-fit md:h-[100%] p-4 md:pb-[71px] md:flex-none">
        <img
          src={import.meta.env.VITE_BACKEND_URL + bookData?.thumbnail}
          className="md:h-full aspect-[2/3] rounded-xl shadow-lg"
        />
      </div>
      <div className="h-fit p-4 pb-[130px] md:pb-[71px] flex flex-col gap-4">
        <div className="bg-white flex items-center gap-2 font-bold py-[10px] ">
          <Button
            type="default"
            shape="round"
            size="small"
            icon={<FaArrowLeft />}
            onClick={() => history.back()}
          >
            Back
          </Button>
        </div>
        <p className="text-5xl font-bold">{bookData?.title}</p>
        <div className="flex flex-wrap gap-2">
          {bookData?.category.map((data, idx) => (
            <Link
              to={"/home/category/" + data._id + "/" + data.name}
              className="text-blue-500 font-bold text-sm bg-slate-100 py-0 px-2 rounded-md"
              key={idx}
            >
              #{data.name}
            </Link>
          ))}
        </div>
        {bookData?.price == 0 ? (
          <span className="font-semibold text-2xl text-green-500">Free</span>
        ) : (
          <p className="flex items-center text-2xl gap-[10px]">
            <span className="font-semibold text-green-500">
              &#8377;
              {bookData?.price - (bookData?.price * bookData?.discount) / 100}
            </span>
            <span className="line-through text-gray-500 font-semibold">
              &#8377;{bookData?.price}
            </span>
            <span className="text-red-400 font-semibold">
              {bookData?.discount}%
            </span>
          </p>
        )}
        <span className="flex gap-2">
          {bookData?.isInMybooks ? (
            <Button
              className="w-full"
              type="primary"
              onClick={() => handleRead(bookData?._id)}
            >
              <ReadOutlined /> Read
            </Button>
          ) : (
            <>
              <Button type="primary" onClick={handleBuy}>
                <BiPurchaseTag /> Buy
              </Button>
              <Button
                onClick={() => handleCart(bookData?._id, bookData?.isInCart)}
              >
                {!bookData?.isInCart ? (
                  <div className="flex gap-2 items-center">
                    <MdAddShoppingCart /> Add to Cart
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <MdRemoveShoppingCart /> Remove From Cart
                  </div>
                )}
              </Button>
              <Button
                onClick={() =>
                  handleWishlist(bookData?._id, bookData?.isInWishlist)
                }
              >
                {!bookData?.isInWishlist ? (
                  <div className="flex gap-2 items-center">
                    <TbHeart />
                    Add To Wishlist
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <TbHeartFilled />
                    Remove From Wishlist
                  </div>
                )}
              </Button>
            </>
          )}
        </span>
        <div className="text-justify">{bookData?.description}</div>
        <h3>Book Details</h3>
        <table className="font-semibold">
          <tbody>
            <tr>
              <td className="text-gray-500">Author</td>
              <td>{bookData?.author}</td>
            </tr>
            <tr>
              <td className="text-gray-500">ISBN</td>
              <td>{bookData?.isbn}</td>
            </tr>
            <tr>
              <td className="text-gray-500">Publisher</td>
              <td>{bookData?.publisher}</td>
            </tr>
            <tr>
              <td className="text-gray-500">Publish Year</td>
              <td>{bookData?.publishyear}</td>
            </tr>
            <tr>
              <td className="text-gray-500">Language</td>
              <td>{bookData?.language}</td>
            </tr>
            <tr>
              <td className="text-gray-500">Total Page</td>
              <td>{bookData?.totalpages}</td>
            </tr>
            <tr>
              <td className="text-gray-500">Edition</td>
              <td>{bookData?.edition}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProductDetails;
