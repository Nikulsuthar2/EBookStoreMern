import React, { useEffect, useState } from "react";
import {
  addcategory,
  deletecategory,
  getcategory,
  updatecategory,
} from "../Utils/AdminDataApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Modal,
  Typography,
  message,
} from "antd";
import { FaPlus, FaTrashCan } from "react-icons/fa6";
import { MdRefresh } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? <Form.Item name={dataIndex}>{inputNode}</Form.Item> : children}
    </td>
  );
};

const BookCategoryPage = () => {
  const [catname, setCatname] = useState("");
  const [categoryList, setCategoryList] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record._id === editingKey;
  const [form] = Form.useForm();
  const { confirm } = Modal;

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
      editable: true,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "40%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span className="flex gap-4 justify-center items-center">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link onClick={() => showConfirm(record._id)}>
              Delete
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const edit = (record) => {
    form.setFieldsValue({
      name: record.name,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    const newValue = form.getFieldValue("name");
    if (newValue == "" || !newValue) return;
    else {
      let str = newValue.trim();
      str = str.charAt(0).toUpperCase() + str.slice(1);
      handleUpdateCategory(key, str);
    }
    setEditingKey("");
  };

  const handleAddCategory = async () => {
    let str = catname.trim();
    str = str.charAt(0).toUpperCase() + str.slice(1);
    const res = await addcategory(str);
    if (res) {
      //console.log(res)
      if (res.status == 201) {
        setCatname("");
        messageApi.success(res.data.Data);
      } else message.error(res.data.Data);
      handleGetCategory();
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    const res = await updatecategory(id, newName);
    if (res) {
      console.log(res);
      if (res.status == 201) messageApi.success(res.data.Data);
      else message.error(res.data.Data);
      handleGetCategory();
    }
  };

  const handleDeleteCategory = async (id) => {
    messageApi.open({
      type: "loading",
      content: "Deleting Category..",
      duration: 0,
    });
    if (Array.isArray(id)) {
      let count = 0;
      id.forEach(async (el) => {
        const res = await deletecategory(el);
        if (res) {
          count++;
        }
        messageApi.destroy();
        if (count == id.length) {
          messageApi.success("Categories deleted");
          handleGetCategory();
        } else {
          messageApi.error("Some Category are not deleted");
        }
      });
      messageApi.destroy();
    } else {
      const res = await deletecategory(id);
      messageApi.destroy();
      if (res) {
        console.log(res.data.Data);
        messageApi.success(res.data.Data);
        handleGetCategory();
      }
    }
  };

  const handleGetCategory = async () => {
    messageApi.open({
      type: "loading",
      content: "Loading Categories..",
      duration: 0,
    });
    const res = await getcategory();
    messageApi.destroy();
    if (res) {
      setCategoryList(res.data.Data);
    }
  };

  const showConfirm = (id) => {
    if (!id || id == "" || id.length == 0) {
      messageApi.info("Please select category to delete");
      return;
    }
    confirm({
      title: "Delete Category",
      icon: <ExclamationCircleFilled />,
      content: "Do you want to delete this category?",
      onOk() {
        handleDeleteCategory(id);
      },
      onCancel() {
        console.log("Cancel deletion");
      },
    });
  };

  useEffect(() => {
    handleGetCategory();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex font-bold text-2xl p-4 border-b-[1px] justify-between sticky top-0 z-50">
        Manage E-Books Categories
        <div className="flex gap-2 font-medium">
          <Button shape="circle" onClick={handleGetCategory}>
            <MdRefresh />
          </Button>
          <Button
            shape="circle"
            onClick={() => handleDeleteCategory(selectedRowKeys)}
          >
            <FaTrashCan />
          </Button>
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
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={mergedColumns}
            dataSource={categoryList ? categoryList : null}
            rowKey="_id"
            size="small"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </div>
    </div>
  );
};

export default BookCategoryPage;
