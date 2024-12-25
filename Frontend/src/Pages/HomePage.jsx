import React, { useEffect, useState } from "react";
import "react-toastify/ReactToastify.css";
import { Empty, message } from "antd";
import { PulseLoader } from "react-spinners";
import {
  addToCart,
  addToMyBooks,
  addToWishlist,
  getCategoryWiseBooks,
  getLatestBookDetails,
  removeFromCart,
  removeFromWishlist,
} from "../Utils/userDataApi";
import LatestBookHeader from "../Components/LatestBookHeader";
import BookCard from "../Components/BookCard";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [latestBook, setLatestBook] = useState(null);
  const [categoryWiseBooks, setCategoryWiseBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLatestBook = async () => {
    const res = await getLatestBookDetails();
    if (res) {
      const data = res.data.Data;
      data.isInCart = res.data.isInCart;
      data.isInMybooks = res.data.isInMybooks;
      data.isInWishlist = res.data.isInWishlist;
      setLatestBook(data);
    }
  };

  const handleCategoryWiseBooks = async () => {
    const res = await getCategoryWiseBooks();
    if (res) {
      setCategoryWiseBooks(res.data.Data);
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
      handleLatestBook();
      handleCategoryWiseBooks();
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
      handleLatestBook();
      handleCategoryWiseBooks();
    }
  };

  const handleAddMyBook = async (id) => {
    const res = await addToMyBooks(id);
    if (res) {
      messageApi.success(res.data.Data);
      handleLatestBook();
      handleCategoryWiseBooks();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    handleLatestBook();
    handleCategoryWiseBooks();
    setIsLoading(false);
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto pb-[50px] md:pb-0 scrollbar-hide bg-gray-50">
      {contextHolder}

      {/* Latest Book Header */}
      {isLoading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <PulseLoader />
        </div>
      ) : latestBook ? (
        <LatestBookHeader
          latestBook={latestBook}
          handleWishlist={handleWishlist}
          handleCart={handleCart}
          handleAddMyBook={handleAddMyBook}
        />
      ) : (
        ""
      )}
      {categoryWiseBooks ? (
        categoryWiseBooks.map((data, idx) => {
          return (
            <div
              key={idx}
              className="flex flex-col px-4 md:px-[50px] lg:px-[100px]"
            >
              <div className="flex justify-between items-center py-[20px]">
                <span className="font-bold text-2xl">{data.categoryName}</span>
                <Link
                  className="text-blue-500 text-sm font-semibold"
                  to={
                    "/home/category/" +
                    data.categoryId +
                    "/" +
                    data.categoryName
                  }
                >
                  View More
                </Link>
              </div>
              <div className="flex gap-[20px] overflow-x-auto scrollbar-hide">
                {data.products.map((book, idx) => {
                  return (
                    <BookCard
                      key={idx}
                      book={book}
                      handleWishlist={handleWishlist}
                      handleCart={handleCart}
                      handleAddMyBook={handleAddMyBook}
                    />
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      <div className="h-[100px]"></div>
    </div>
  );
};

export default HomePage;
