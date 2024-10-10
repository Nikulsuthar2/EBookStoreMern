import { ArrowUpOutlined, BookOutlined, BookTwoTone, GroupOutlined, LikeOutlined, UserOutlined } from "@ant-design/icons";
import { Card, message, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import { getdashboardstats } from "../Utils/AdminDataApi";

const AdminHomePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [stats, setStats] = useState(null);

  const handleGetStats = async () => {
    const res = await getdashboardstats();
    if (res) {
      //console.log(res.data);
      setStats(res.data.Data);
    }
  };

  useEffect(() => {
    handleGetStats();
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex gap-4 font-bold text-2xl p-4 border-b-[1px] sticky top-0 z-50">
        Dashboard
      </div>
      <div className="p-4">
        <div className="flex gap-1">
          <Card size="small">
            <Statistic
              title="Total Users"
              value={stats ? stats.totalUser : 0}
              prefix={<UserOutlined/>}
              valueStyle={{
                color: "#3f8600",
              }}
            />
          </Card>
          <Card size="small">
            <Statistic
              title="Total Books"
              value={stats ? stats.totalBook : 0}
              prefix={<BookOutlined/>}
              valueStyle={{
                color: "#3f8600",
              }}
            />
          </Card>
          <Card size="small">
            <Statistic
              title="Total Categories"
              value={stats ? stats.totalCategory : 0}
              prefix={<GroupOutlined />}
              valueStyle={{
                color: "#3f8600",
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
