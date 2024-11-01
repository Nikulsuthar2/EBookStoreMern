import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookDetails, getBookStream } from "../Utils/userDataApi";
import { Button } from "antd";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import PDFViewer from "../Components/PDFViewer";

const BookReaderPage = () => {
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);

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

  useEffect(() => {
    handleGetBookDetails(bookId);
  }, []);

  return (
    <div className="flex-grow px-0 md:px-[50px] lg:px-[100px] overflow-hidden flex justify-between">
      <div className="hidden w-[30%] overflow-auto py-4 pr-4 scrollbar-hide md:flex md:flex-col gap-2">
        <div>
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
        <h1 className="text-2xl font-semibold">
          {bookData?.title} by {bookData?.author}
        </h1>
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
        <div className="text-justify">{bookData?.description}</div>
        <div>
          <div className="w-full border-[1px] rounded-lg overflow-hidden">
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Author
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                {bookData?.author}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Publisher
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                {bookData?.publisher}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Language
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                {bookData?.language}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                ISBN
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                {bookData?.isbn}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Publish Year
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                {bookData?.publishyear}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Edition
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white">
                {bookData?.edition}
              </span>
            </div>
            <div className="flex justify-between border-b-[1px]">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Price
              </span>
              <span className="w-[50%] p-2 text-sm text-end bg-white font-bold text-green-500">
                &#8377;{bookData?.price}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="w-[50%] p-2 text-sm font-[600] border-r-[1px] bg-[#fafafa]">
                Discount
              </span>
              <span className="w-[50%] p-2 text-sm text-end font-bold bg-white text-red-500">
                {bookData?.discount}%
              </span>
            </div>
          </div>
        </div>
        <img
          className="flex-none w-full aspect-[2/3] rounded-lg"
          src={import.meta.env.VITE_BACKEND_URL + bookData?.thumbnail}
        />
      </div>
      <div className="w-full h-full overflow-hidden md:w-[70%]">
        {bookData ? (
          <PDFViewer
            pdfUrl={import.meta.env.VITE_BACKEND_URL + bookData?.bookurl}
          />
        ) : (
          "Loading PDF..."
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
