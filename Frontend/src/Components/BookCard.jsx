import { ReadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { BiPurchaseTag, BiSolidBookAdd } from "react-icons/bi";
import { MdAddShoppingCart, MdRemoveShoppingCart } from "react-icons/md";
import { TbHeart, TbHeartFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

const BookCard = ({ book, handleWishlist, handleCart, handleAddMyBook }) => {
  const navigate = useNavigate();
  const handleBuy = async () => {
    await handleCart(book._id, false);
    navigate("/home/cart/");
  };

  const handleRead = (bookId) => {
    navigate("/home/readbook/" + bookId);
  };

  return (
    <div
      className="relative flex-none flex flex-col gap-1 w-[180px] rounded-[15px]"
      key={book._id}
    >
      <Link to={"/home/book/" + book._id}>
        <img
          title={book.title}
          src={import.meta.env.VITE_BACKEND_URL + book.thumbnail}
          className="w-[180px] shadow-lg rounded-[10px] aspect-[2/3] object-cover"
        />
      </Link>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
        {book.title}
      </span>
      {book.price == 0 ? (
        <span className="font-semibold text-green-600">Free</span>
      ) : (
        <div className="flex gap-1">
          <span className="font-semibold text-green-600">
            &#8377;
            {(book.price - (book.price * book.discount) / 100).toFixed(2)}
          </span>
          <span className="line-through text-gray-400 font-semibold">
            &#8377;{book.price}
          </span>
          <span className="text-red-500 font-semibold">{book.discount}%</span>
        </div>
      )}
      {book.price == 0 ? (
        <div className="flex gap-3 justify-between">
          {!book.isInMybooks ? (
            <Button shape="circle" onClick={() => handleAddMyBook(book._id)}>
              <BiSolidBookAdd />
            </Button>
          ) : (
            ""
          )}
          <Button
            className="w-full"
            onClick={() => handleRead(book._id)}
          >
            <ReadOutlined /> Read
          </Button>
        </div>
      ) : book.isInMybooks ? (
        <Button
          className="w-full"
          onClick={() => handleRead(book._id)}
        >
          <ReadOutlined /> Read
        </Button>
      ) : (
        <>
          <div className="flex gap-2 justify-between">
            <Button
              onClick={() => handleCart(book._id, book.isInCart)}
              title={book.isInCart ? "Remove From Cart" : "Add to Cart"}
              shape="circle"
            >
              {book.isInCart ? <MdRemoveShoppingCart /> : <MdAddShoppingCart />}
            </Button>
            <Button className="w-full" onClick={handleBuy}>
              <BiPurchaseTag /> Buy
            </Button>
          </div>
          <Button
            onClick={() => handleWishlist(book._id, book.isInWishlist)}
            className="absolute top-2 z-10 right-2 shadow-lg"
            title={
              book.isInWishlist ? "Remove From Wishlist" : "Add To Wishlist"
            }
            shape="circle"
            type={book.isInWishlist ? "primary" : "default"}
          >
            {book.isInWishlist ? <TbHeartFilled /> : <TbHeart />}
          </Button>
        </>
      )}
    </div>
  );
};

export default BookCard;
