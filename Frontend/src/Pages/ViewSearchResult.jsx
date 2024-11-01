import { Button, Empty, message } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  addToCart,
  addToWishlist,
  getBookSearchResult,
  removeFromCart,
  removeFromWishlist,
} from "../Utils/userDataApi";
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
      messageApi.success(res.data.Data);
      handleGetSearchResult(query);
    }
  };

  const handleGetSearchResult = async (query) => {
    const res = await getBookSearchResult(query);
    if (res) {
      setBookData(res.data.Data);
    }
  };

  useEffect(() => {
    if (query && query != "") {
      handleGetSearchResult(query);
    }
  }, [query]);

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
      {bookData && bookData.length > 0 ? (
        <div className="flex flex-wrap gap-[40px] mb-[70px]">
          {bookData.map((data, idx) => {
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
      ) : (
        <div className="w-full h-[60%] flex justify-center items-center">
          <Empty />
        </div>
      )}
    </div>
  );
};

export default ViewSearchResult;
