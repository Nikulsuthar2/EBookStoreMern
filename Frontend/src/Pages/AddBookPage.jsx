import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPercent, FaRupeeSign } from "react-icons/fa6";
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
} from "antd";
import { InboxOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { TbRosetteDiscount } from "react-icons/tb";
import { languages } from "../Utils/data";
import { addBook, getcategory } from "../Utils/AdminDataApi";

const AddBookPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedItems, setSelectedItems] = useState([]);
  const [categoryList, setCategoryList] = useState(null);
  const [bookthumb, setBookthumb] = useState(null);
  const [bookfile, setBookfile] = useState(null);

  const [booktitle, setBooktitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [ISBN, setISBN] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalpage, setTotalpage] = useState(0)
  const [language, setLanguage] = useState("English");
  const [desc, setDesc] = useState("");

  const navigate = useNavigate();

  const handleAddBook = async (e) => {
    const formData = new FormData();
    formData.append('title',booktitle);
    formData.append('author',author);
    formData.append('publisher',publisher);
    formData.append('publishyear',publishYear);
    formData.append('isbn',ISBN);
    formData.append('price',price);
    formData.append('discount',discount);
    formData.append('language',language);
    formData.append('totalpage',totalpage);
    formData.append('category',selectedItems.map((data)=>data.value));
    formData.append('description',desc);
    formData.append('bookfile',bookfile);
    formData.append('thumbnail',bookthumb);

    messageApi.open({
      type: 'loading',
      content: 'Loading Books..',
      duration: 0,
    });
    const res = await addBook(formData);
    messageApi.destroy();
    if(res){
      if(res.data.Result){
        messageApi.success(res.data.Data);
        setBooktitle("");
        setAuthor("");
        setPublisher("");
        setPublishYear("");
        setISBN("");
        setTotalpage(0);
        setPrice(0);
        setDiscount(0);
        setLanguage("English");
        setSelectedItems([]);
        setDesc("")
        setBookfile(null);
        setBookthumb(null);
      }
      else
        messageApi.error(res.data.Data);
    }
  };

  const handleGetCategory = async () => {
    const res = await getcategory();
    if (res) {
      setCategoryList(res.data.Data.filter((o) => !selectedItems.includes(o)));
    }
  };

  useEffect(() => {
    handleGetCategory();
  });

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex gap-4 font-bold text-2xl p-4 border-b-[1px] sticky top-0 z-50">
        <Button type="primary" onClick={()=>navigate('/admin/ebooks')}>
          <FaArrowLeft/>
        </Button>
        Add Book
      </div>
      <div className="p-4">
        <Form className="flex flex-col gap-4" onFinish={handleAddBook}>
          <div className="flex justify-between gap-4">
            <div className="flex w-[30%] flex-col gap-1">
              <label>Book Title</label>
              <Input
                value={booktitle}
                onChange={(e) => setBooktitle(e.target.value)}
                placeholder="Enter book name"
                allowClear
                required
              />
              <label>Author Name</label>
              <Input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Enter author name" allowClear required />
              <label>Publisher</label>
              <Input value={publisher} onChange={(e)=>setPublisher(e.target.value)} placeholder="Enter publisher name" allowClear required />
              <label>Publish Year</label>
              <DatePicker onPickerValueChange={(e)=>setPublishYear(e.year())} picker="year" disabledDate={(date)=> date.year() > (new Date()).getFullYear()} required />
              <label>ISBN</label>
              <Input
              value={ISBN} onChange={(e)=>setISBN(e.target.value)}
                type="number"
                placeholder="Enter book isbn"
                allowClear
                required
              />
              <label>Total Pages</label>
              <Input
              value={totalpage} onChange={(e)=>setTotalpage(e.target.value)}
                type="number"
                placeholder="Enter total pages"
                allowClear
                min={1}
                required
              />
            </div>
            <div className="flex w-[30%] flex-col gap-1">
              <label>Price</label>
              <Input
              value={price} onChange={(e)=>setPrice(e.target.value)}
                type="number"
                prefix={<MdOutlineCurrencyRupee />}
                placeholder="Enter book price"
                min={0}
                allowClear
                required
              />
              <label>Discount</label>
              <Input
              value={discount} onChange={(e)=>setDiscount(e.target.value)}
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
                onChange={(e)=>{
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
                labelInValue
                filterOption={(ip,op)=>
                  op.title.toLowerCase().includes(ip.toLowerCase())
                }
                // options={
                //   categoryList
                //     ? categoryList.map((item) => ({
                //         value: item._id,
                //         label: item.name,
                //       }))
                //     : []
                // }
              >
                {
                  categoryList
                    ? categoryList.map((item) => (
                      <Select.Option key={item._id} value={item._id} title={item.name}>
                        {item.name}
                      </Select.Option>
                    ))
                    : []
                }
              </Select>
              <label>Description</label>
              <Input.TextArea rows={4}value={desc} onChange={(e)=>setDesc(e.target.value)} />
            </div>
            <div className="flex w-[40%] flex-col gap-2 ">
              <label>Book File</label>
              <Form.Item
                name={"bookfile"}
                rules={[{ required: true, message: "Please input book file" }]}
              >
                <Upload.Dragger
                  maxCount={1}
                  name="bookfile"
                  height={"150px"}
                  beforeUpload={(file) => {
                    if (file.type === "application/pdf") {
                      setBookfile(file);
                      return false;
                    } else {
                      message.error(`${file.name} is not a pdf file`);
                      return Upload.LIST_IGNORE;
                    }
                  }}
                  onRemove={(file) => {
                    setBookfile(null);
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
              </Form.Item>
              <label>Book Thumbnail</label>
              <Form.Item
                name={"bookthumb"}
                rules={[
                  { required: true, message: "Please input book thumbnail" },
                ]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  name="bookthumb"
                  multiple={false}
                  height={"150px"}
                  beforeUpload={(file) => {
                    if (
                      file.type === "image/png" ||
                      file.type === "image/jpeg"
                    ) {
                      setBookthumb(file);
                      return false;
                    } else {
                      message.error(`${file.name} is not a png or jpg file`);
                      return Upload.LIST_IGNORE;
                    }
                  }}
                  onRemove={(file) => {
                    setBookthumb(null);
                  }}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-center">
            <Button className="mt-4 w-[300px]" type="primary" htmlType="submit">
              Upload
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddBookPage;
