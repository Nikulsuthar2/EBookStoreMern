import { ReadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { MdAddShoppingCart, MdRemoveShoppingCart } from "react-icons/md";
import { TbHeart, TbHeartFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

const LatestBookHeader = ({ latestBook, handleWishlist, handleCart }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center gap-10 bg-gray-100 p-[20px]">
      <Link className="flex-none" to={"/home/book/" + latestBook._id}>
        <img
          src={import.meta.env.VITE_BACKEND_URL + latestBook.thumbnail}
          className="aspect-[2/3] w-[180px] shadow-lg rounded-[10px] object-cover"
        />
      </Link>
      <div className="flex flex-col gap-2 md:w-[50%]">
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
          {latestBook.price == 0 ? (
            <>
              {!latestBook.isInMybooks ? (
                <Button>
                  <MdAddShoppingCart /> Add to My Books
                </Button>
              ) : (
                ""
              )}
              <Button>
                <a href={import.meta.env.VITE_BACKEND_URL + latestBook.bookurl} target="_blank"><ReadOutlined /> Read</a>
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleCart(latestBook._id, latestBook.isInCart)}
              >
                {!latestBook.isInCart ? (
                  <div className="flex gap-2 items-center">
                    <MdAddShoppingCart /> Add to Cart
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <MdRemoveShoppingCart /> Remove From Cart
                  </div>
                )}
              </Button>
              <Button>
                {!latestBook.isInMybooks ? (
                  <div className="flex gap-2 items-center">
                    <BiPurchaseTag /> Buy
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <ReadOutlined /> Read
                  </div>
                )}
              </Button>
              <Button
                onClick={() =>
                  handleWishlist(latestBook._id, latestBook.isInWishlist)
                }
                type={latestBook.isInWishlist ? "primary" : "default"}
              >
                {!latestBook.isInWishlist ? (
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
      </div>
    </div>
  );
};

export default LatestBookHeader;
