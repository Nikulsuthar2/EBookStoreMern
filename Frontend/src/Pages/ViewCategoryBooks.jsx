import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addToCart,
  addToWishlist,
  getCategoryBooks,
  removeFromCart,
  removeFromWishlist,
} from "../Utils/userDataApi";
import BookCard from "../Components/BookCard";
import { Button, message } from "antd";
import { FaArrowLeft } from "react-icons/fa6";

const ViewCategoryBooks = () => {
  const { catId, catName } = useParams();
  const [bookData, setBookData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleWishlist = async (id, isInWishlist) => {
    let res;
    if (isInWishlist) {
      res = await removeFromWishlist(id);
    } else {
      res = await addToWishlist(id);
    }
    if (res) {
      console.log(res.data);
      messageApi.success(res.data.Data);
      handleGetCategoryBook(catId);
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
      console.log(res.data);
      messageApi.success(res.data.Data);
      handleGetCategoryBook(catId);
    }
  };

  const handleGetCategoryBook = async (id) => {
    const res = await getCategoryBooks(id);
    if (res) {
      console.log(res.data);
      setBookData(res.data.Data);
    }
  };

  useEffect(() => {
    handleGetCategoryBook(catId);
  }, []);

  return (
    <div className="px-24 h-full bg-slate-50 overflow-auto">
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

        <p className="font-bold text-3xl">{catName}</p>
      </div>
      <div className="flex flex-wrap gap-[40px] mb-[70px]">
        {bookData &&
          bookData.map((data, idx) => {
            return (
              <BookCard
                key={idx}
                book={data}
                handleWishlist={handleWishlist}
                handleCart={handleCart}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ViewCategoryBooks;
