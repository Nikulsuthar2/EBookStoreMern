import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPercent, FaRupeeSign } from "react-icons/fa6";
import moment from "moment";
import bookdemo from "../assets/book1.jpg";
import {
  Button,
  Table,
  Tag,
  Space,
  message,
  Form,
  Upload,
  Input,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import { InboxOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { TbRosetteDiscount } from "react-icons/tb";
import { languages } from "../Utils/data";
import { addBook, getcategory, updateBook } from "../Utils/AdminDataApi";
import { getBookDetails } from "../Utils/userDataApi";

const AddBookPage = ({ title, isUpdate }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [bookData, setBookData] = useState(null);
  const [categoryList, setCategoryList] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);
  const [bookthumb, setBookthumb] = useState([]);
  const [bookfile, setBookfile] = useState([]);
  const [booktitle, setBooktitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("EBookStore");
  const [publishYear, setPublishYear] = useState(null);
  const [ISBN, setISBN] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalpage, setTotalpage] = useState(0);
  const [language, setLanguage] = useState("English");
  const [desc, setDesc] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const handleAddBook = async (e) => {
    const formData = new FormData();
    if (isUpdate) {
      if (booktitle != "" && booktitle != bookData.title)
        formData.append("title", booktitle);
      if (author != "" && author != bookData.author)
        formData.append("author", author);
      if (publisher != "" && publisher != bookData.publisher)
        formData.append("publisher", publisher);
      if (publishYear != "" && publishYear.toString() != bookData.publishyear)
        formData.append("publishyear", publishYear);
      if (ISBN != "" && ISBN != bookData.isbn) formData.append("isbn", ISBN);
      if (price != "" && price != bookData.price)
        formData.append("price", price);
      if (discount != "" && discount != bookData.discount)
        formData.append("discount", discount);
      if (language != "" && language != bookData.language)
        formData.append("language", language);
      if (totalpage != "" && totalpage != bookData.totalpages)
        formData.append("totalpages", totalpage);
      if (desc != bookData.description) formData.append("description", desc);
      formData.append(
        "category",
        selectedItems.length != 0 ? selectedItems.map((data) => data) : []
      );
      if (bookfile.length > 0) formData.append("bookfile", bookfile[0]);
      if (bookthumb.length > 0) formData.append("thumbnail", bookthumb[0]);

      messageApi.open({
        type: "loading",
        content: "Updating Book..",
        duration: 0,
      });
      const res = await updateBook(bookData._id, formData);
      messageApi.destroy();
      if (res) {
        if (res.data.Result) {
          messageApi.success(res.data.Data);
          setTimeout(() => {
            navigate("/admin/ebooks");
          }, 1000);
        } else messageApi.error(res.data.Data);
      }
    } else {
      if (bookfile.length == 0 || bookthumb.length == 0) {
        messageApi.error("Please upload a book pdf or thumbnail image");
        return;
      }
      formData.append("title", booktitle);
      formData.append("author", author);
      formData.append("publisher", publisher);
      formData.append("publishyear", publishYear);
      formData.append("isbn", ISBN);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("language", language);
      formData.append("totalpages", totalpage);
      console.log(selectedItems);
      formData.append(
        "category",
        selectedItems.map((data) => data)
      );
      formData.append("description", desc);
      formData.append("bookfile", bookfile[0]);
      formData.append("thumbnail", bookthumb[0]);

      messageApi.open({
        type: "loading",
        content: "Adding Book..",
        duration: 0,
      });
      const res = await addBook(formData);
      messageApi.destroy();
      if (res) {
        if (res.data.Result) {
          messageApi.success(res.data.Data);
          setBooktitle("");
          setAuthor("");
          setPublisher("EBookStore");
          setPublishYear("");
          setISBN("");
          setTotalpage(0);
          setPrice(0);
          setDiscount(0);
          setLanguage("English");
          setSelectedItems([]);
          setDesc("");
          setBookthumb([]);
          setBookfile([]);
        } else messageApi.error(res.data.Data);
      }
    }
  };

  const handleGetCategory = async () => {
    const res = await getcategory();
    if (res) {
      setCategoryList(res.data.Data.filter((o) => !selectedItems.includes(o)));
    }
  };

  const handleGetBookDetails = async (id) => {
    const res = await getBookDetails(id);
    if (res) {
      setBookData(res.data.Data);
      setBooktitle(res.data.Data.title);
      setAuthor(res.data.Data.author);
      setPublisher(res.data.Data.publisher);
      setPublishYear(res.data.Data.publishyear);
      setISBN(res.data.Data.isbn);
      setTotalpage(res.data.Data.totalpages);
      setPrice(res.data.Data.price);
      setDiscount(res.data.Data.discount);
      setLanguage(res.data.Data.language);
      setSelectedItems(res.data.Data.category.map((data) => data._id));
      setDesc(res.data.Data.description);
    }
  };

  useEffect(() => {
    if (isUpdate) {
      if (!id) {
        navigate("/admin/ebooks");
      }
      handleGetBookDetails(id);
    }
    handleGetCategory();
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex gap-4 font-bold text-2xl p-4 border-b-[1px] sticky top-0 z-50">
        <Button type="primary" onClick={() => navigate("/admin/ebooks")}>
          <FaArrowLeft />
        </Button>
        {title}
      </div>
      <div className="p-4">
        <Form className="flex flex-col gap-4" onFinish={handleAddBook}>
          <div className="flex justify-between gap-4 flex-col md:flex-row">
            <div className="flex md:w-[30%] flex-col gap-1">
              <label>Book Title</label>
              <Input
                value={booktitle}
                onChange={(e) => setBooktitle(e.target.value)}
                placeholder="Enter book name"
                allowClear
                required
              />
              <label>Author Name</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                allowClear
                required
              />
              <label>Publisher</label>
              <Input
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Enter publisher name"
                allowClear
                required
              />
              <label>Publish Year</label>
              <DatePicker
                value={publishYear ? moment().year(publishYear) : null}
                onPickerValueChange={(e) => setPublishYear(e.year())}
                picker="year"
                disabledDate={(date) => date.year() > new Date().getFullYear()}
                required
              />
              <label>ISBN</label>
              <Input
                value={ISBN}
                onChange={(e) => setISBN(e.target.value)}
                type="number"
                placeholder="Enter book isbn"
                allowClear
                required
              />
              <label>Total Pages</label>
              <Input
                value={totalpage}
                onChange={(e) => setTotalpage(e.target.value)}
                type="number"
                placeholder="Enter total pages"
                allowClear
                min={1}
                required
              />
            </div>
            <div className="flex md:w-[30%] flex-col gap-1">
              <label>Price</label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                prefix={<MdOutlineCurrencyRupee />}
                placeholder="Enter book price"
                min={0}
                allowClear
                required
              />
              <label>Discount</label>
              <Input
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                type="number"
                prefix={<FaPercent />}
                placeholder="Enter book price"
                allowClear
                min={0}
                required
              />
              <label>Language</label>
              <Select
                value={language}
                onChange={(e) => {
                  setLanguage(e);
                }}
                required
                showSearch
                placeholder="Search to Select language"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={languages}
              />
              <label>Category</label>
              <Select
                mode="multiple"
                required
                showSearch
                placeholder="Select categories"
                value={selectedItems}
                onChange={setSelectedItems}
                optionFilterProp="children"
                filterOption={(ip, op) =>
                  op.title.toLowerCase().includes(ip.toLowerCase())
                }
              >
                {categoryList
                  ? categoryList.map((item) => (
                      <Select.Option
                        key={item._id}
                        value={item._id}
                        title={item.name}
                      >
                        {item.name}
                      </Select.Option>
                    ))
                  : []}
              </Select>
              <label>Description</label>
              <Input.TextArea
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="flex md:w-[40%] flex-col gap-2 ">
              <label>Book File</label>
              <Upload.Dragger
                fileList={bookfile}
                maxCount={1}
                name="bookfile"
                height={"150px"}
                beforeUpload={(file) => {
                  if (file.type === "application/pdf") {
                    setBookfile([file]);
                    return false;
                  } else {
                    message.error(`${file.name} is not a pdf file`);
                    return Upload.LIST_IGNORE;
                  }
                }}
                onRemove={(file) => {
                  setBookfile([]);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">Upload a single pdf file.</p>
              </Upload.Dragger>
              <label>Book Thumbnail</label>
              <Upload
                fileList={bookthumb}
                listType="picture-card"
                maxCount={1}
                name="bookthumb"
                multiple={false}
                height={"150px"}
                beforeUpload={(file) => {
                  if (file.type === "image/png" || file.type === "image/jpeg") {
                    setBookthumb([file]);
                    return false;
                  } else {
                    message.error(`${file.name} is not a png or jpg file`);
                    return Upload.LIST_IGNORE;
                  }
                }}
                onRemove={(file) => {
                  setBookthumb([]);
                }}
              >
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="mt-4 w-full md:w-[300px]"
              type="primary"
              htmlType="submit"
            >
              {isUpdate ? "Update Book" : "Upload Book"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddBookPage;
