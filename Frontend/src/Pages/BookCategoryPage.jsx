import React, { useEffect, useState } from "react";
import { addcategory, getcategory } from "../Utils/AdminDataApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Button, Input, Space, Table, Tag, message } from "antd";
import { FaPlus } from "react-icons/fa6";

const columns = [
  {
    title: "S.No.",
    dataIndex: "sno",
    key: "sno",
    render: (text, rec, idx) => idx + 1,
    align: "center",
  },
  {
    title: "ID",
    dataIndex: "_id",
    key: "id",
    align: "center",
  },
  {
    title: "Category Name",
    dataIndex: "name",
    key: "name",
    align: "center",
    render: (text, rec) => <Input value={text} />,
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    width: "40%",
    render: (_, record) => (
      <Space size="middle">
        <Button type="text">Edit</Button>
        <a>Delete</a>
      </Space>
    ),
  },
];

const updateCategory = async () => {};

const BookCategoryPage = () => {
  const [catname, setCatname] = useState("");
  const [categoryList, setCategoryList] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectionType, setSelectionType] = useState('checkbox');

  const handleAddCategory = async () => {
    let str = catname.trim();
    str = str.charAt(0).toUpperCase() + str.slice(1);
    const res = await addcategory(str);
    if (res) {
        console.log(res)
      if(res.status == 201) messageApi.success(res.data.Data);
      else message.error(res.data.Data);
      handleGetCategory();
    }
  };
  const handleGetCategory = async () => {
    const res = await getcategory();
    if (res) {
      setCategoryList(res.data.Data);
    }
  };
  useEffect(() => {
    handleGetCategory();
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex font-bold text-2xl p-4 border-b-[1px] justify-between sticky top-0 z-50">
        Manage E-Books Categories
        <div className="flex gap-2 font-medium">
          <Input
            onChange={(e) => setCatname(e.target.value)}
            value={catname}
            placeholder="Enter category name"
            spellCheck={true}
            allowClear
            variant="filled" 
          />
          <Button type="primary" onClick={handleAddCategory}>
            <FaPlus /> Add Category
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={categoryList ? categoryList : null}
        />
      </div>
    </div>
  );
};

export default BookCategoryPage;
