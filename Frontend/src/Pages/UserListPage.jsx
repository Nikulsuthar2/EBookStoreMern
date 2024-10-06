import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Input, Space, message } from "antd";
import { getallUsers } from "../Utils/AdminDataApi";
import { MdRefresh } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";

const UserListPage = () => {
  const [userlist, setUserlist] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => <div>{text}</div>,
  });
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
      key: "_id",
      align: "center",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      fixed: "left",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Total Books",
      dataIndex: "totalbooks",
      key: "totalbooks",
      align: "center",
      render: (_, rec) => <div>{rec.mybooks?.length}</div>,
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
  ];
  const handleGetAllUser = async () => {
    messageApi.open({
      type: "loading",
      content: "Loading Users..",
      duration: 0,
    });
    const res = await getallUsers();
    messageApi.destroy();
    if (res) {
      console.log(res.data.Data);
      setUserlist(res.data.Data);
    }
  };

  useEffect(() => {
    handleGetAllUser();
  }, []);
  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex font-bold text-2xl p-4 border-b-[1px] justify-between  sticky top-0 z-50">
        Users
        <div className="flex gap-2">
          <Button shape="circle" onClick={handleGetAllUser}>
            <MdRefresh />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Table
          columns={columns}
          dataSource={userlist ? userlist : []}
          rowKey="_id"
          size="small"
        />
      </div>
    </div>
  );
};

export default UserListPage;
