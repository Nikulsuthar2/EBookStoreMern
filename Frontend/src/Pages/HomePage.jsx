import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/ReactToastify.css";
import { Button, Card, Empty, message } from "antd";

import {
  BarLoader,
  BeatLoader,
  ClipLoader,
  DotLoader,
  MoonLoader,
  PulseLoader,
} from "react-spinners";
import {
  ReadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { BiPurchaseTag } from "react-icons/bi";
import { SiWish } from "react-icons/si";
import { getCategoryWiseBooks, getLatestBookDetails } from "../Utils/userDataApi";

const HomePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [latestBook, setLatestBook] = useState(null);
  const [categoryWiseBooks, setCategoryWiseBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLatestBook = async () => {
    const res = await getLatestBookDetails();
    if (res) {
      setLatestBook(res.data.Data);
      console.log(res.data.Data);
    }
  };

  const handleCategoryWiseBooks = async () => {
    const res = await getCategoryWiseBooks();
    if (res) {
      setCategoryWiseBooks(res.data.Data);
      console.log(res.data.Data);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    handleLatestBook();
    handleCategoryWiseBooks();
    setIsLoading(false);
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto bg-gray-50">
      {contextHolder}

      {isLoading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <PulseLoader />
        </div>
      ) : latestBook ? (
        <div className="flex items-center justify-center gap-10 bg-gray-100 p-[20px]">
          <img
            src={import.meta.env.VITE_BACKEND_URL + latestBook.thumbnail}
            className="aspect-[2/3] w-[180px] shadow-lg rounded-[10px] object-cover"
          />
          <div className="flex flex-col gap-2 w-[50%]">
            <h1 className="font-bold text-red-500">New Arrival!</h1>
            <span className="font-bold text-4xl">{latestBook.title}</span>
            {latestBook.price == 0 ? (
              <span className="font-semibold text-green-500 text-xl">Free</span>
            ) : (
              <p className="flex items-center gap-[10px]">
                <span className="font-semibold text-green-500">
                  &#8377;
                  {latestBook.price -
                    (latestBook.price * latestBook.discount) / 100}
                </span>
                <span className="line-through text-gray-600 font-semibold">
                  &#8377;{latestBook.price}
                </span>
                <span className="text-red-400 font-semibold">
                  {latestBook.discount}%
                </span>
              </p>
            )}

            <span className="line-clamp-3">{latestBook.description}</span>
            <span className="flex gap-2">
              <Button><ShoppingCartOutlined /> Add to Cart</Button>
              <Button><BiPurchaseTag />Buy</Button>
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      {categoryWiseBooks ? (
        categoryWiseBooks.map((data, idx) => {
          return (
            <div key={idx} className="flex flex-col px-[100px]">
              <div className="flex justify-between p-[20px]">
                <span className="font-bold text-2xl">{data.categoryName}</span>
              </div>
              <div className="px-[20px] flex gap-[20px]">
                {data.products.map((book) => {
                  return (
                    <div
                      className="flex flex-col gap-1 w-[180px] rounded-[15px]"
                      key={book._id}
                    >
                      <img
                        title={book.title}
                        src={import.meta.env.VITE_BACKEND_URL + book.thumbnail}
                        className="w-[180px] shadow-lg rounded-[10px] aspect-[2/3] object-cover"
                      />
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                        {book.title}
                      </span>
                      {book.price == 0 ? (
                        <span className="font-semibold text-green-600">
                          Free
                        </span>
                      ) : (
                        <div className="flex gap-1">
                          <span className="font-semibold text-green-600">
                            &#8377;
                            {book.price - (book.price * book.discount) / 100}
                          </span>
                          <span className="line-through text-gray-400 font-semibold">
                            &#8377;{book.price}
                          </span>
                          <span className="text-red-500 font-semibold">
                            {book.discount}%
                          </span>
                        </div>
                      )}
                      {book.price == 0 ? (
                        <div className="flex gap-3 justify-between">
                          <Button shape="circle">
                            <SiWish />
                          </Button>
                          <Button className="w-full">
                            <ReadOutlined /> Read
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-between">
                          <Button shape="circle">
                            <ShoppingCartOutlined />
                          </Button>
                          <Button className="w-full">
                            <BiPurchaseTag /> Buy
                          </Button>
                        </div>
                      )}
                    </div>
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
