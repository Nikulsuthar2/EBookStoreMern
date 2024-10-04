import React, { useEffect, useState } from "react";
import "../CSS/adminhome.css";
import "../CSS/booklist.css";
import { Link } from "react-router-dom";
import { getallbooks } from "../Utils/AdminDataApi";

const BookListPage = () => {
  const [booklist, setBooklist] = useState(null);
  const [isGrid, setIsGrid] = useState(false);

  const handleGetAllBooks = async () => {
    const res = await getallbooks();
    if (res) {
      console.log(res);
      setBooklist(res.data.Data);
    }
  };

  useEffect(() => {
    handleGetAllBooks();
  }, []);

  return (
    <div className="adminmainbody">
      <div className="header">
        <h1>Manage E-Books</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link className="primarybtn" to={"/admin/category"}>
            Add Book Category
          </Link>
          <Link className="primarybtn" to={"/admin/ebooks/addBook"}>
            + Add Book
          </Link>
        </div>
      </div>
      <div className="mainlist">
        <div className="litopbar">
          <label>E-Book List</label>
        </div>
        {!isGrid ? (
          <div className="litable">
            <table>
              <tr>
                <th width="40px">Sno</th>
                <th width="40px">Thumbnail</th>
                <th>Book Name</th>
                <th>ISBN</th>
                <th>price</th>
                <th>Discount</th>
                <th>Author</th>
                <th>Publisher</th>
                <th width="40px">Publish Year</th>
                <th width="40px">Language</th>
                <th>Edition</th>
                <th width="120px">Operations</th>
              </tr>
              {booklist
                ? booklist.map((data, idx) => {
                    return (
                      <tr>
                        <td>{idx + 1}</td>
                        <td>
                          <a
                            target="_blank"
                            href={
                              import.meta.env.VITE_BACKEND_URL + data.bookurl
                            }
                          >
                            <img
                              className="bookcover"
                              src={
                                import.meta.env.VITE_BACKEND_URL +
                                data.thumbnail
                              }
                              width={"50px"}
                            />
                          </a>
                        </td>
                        <td>{data.title}</td>
                        <td>{data.isbn}</td>
                        <td>{data.price == 0 ? "Free" : "$" + data.price}</td>
                        <td>
                          {data.discount == 0 ? "No" : data.discount + "%"}
                        </td>
                        <td>{data.author}</td>
                        <td>{data.publisher}</td>
                        <td>{data.publishyear}</td>
                        <td>{data.language}</td>
                        <td>{data.edition}</td>
                        <td></td>
                      </tr>
                    );
                  })
                : ""}
            </table>
          </div>
        ) : (
          <div className="bookgrid">
            {booklist
              ? booklist.map((data, idx) => {
                  return (
                    <div className="bookcard">
                      <a href={import.meta.env.VITE_BACKEND_URL + data.bookurl}>
                        <img
                          className="bookcover"
                          src={
                            import.meta.env.VITE_BACKEND_URL + data.thumbnail
                          }
                          width={"200px"}
                        />
                      </a>
                      <span>{data.title}</span>
                      <spna>
                        {data.price == 0 ? "Free" : "$" + data.price}{" "}
                        {data.discount == 0 ? "" : data.discount + "%"}
                      </spna>
                      <div></div>
                    </div>
                  );
                })
              : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListPage;
