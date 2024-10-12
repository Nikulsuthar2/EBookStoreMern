import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { addToCart, addToWishlist, getBookSearchResult, removeFromCart, removeFromWishlist } from "../Utils/userDataApi";
import { FaArrowLeft } from "react-icons/fa6";
import BookCard from "../Components/BookCard";

const ViewSearchResult = () => {
  const [bookData, setBookData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const query = queryParams.get("query");

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
      handleGetSearchResult(query);
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
      handleGetSearchResult(query);
    }
  };

  const handleGetSearchResult = async (query) => {
    const res = await getBookSearchResult(query);
    if (res) {
      console.log(res.data);
      setBookData(res.data.Data);
    }
  };

  useEffect(() => {
    if (query && query != "") {
      handleGetSearchResult(query);
    }
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
        <p className="font-bold text-3xl">Search for "{query}"</p>
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

export default ViewSearchResult;
