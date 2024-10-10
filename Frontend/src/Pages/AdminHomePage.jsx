import { ArrowUpOutlined, LikeOutlined } from "@ant-design/icons";
import { Card, message, Statistic } from "antd";
import React from "react";

const AdminHomePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex gap-4 font-bold text-2xl p-4 border-b-[1px] sticky top-0 z-50">
        Dashboard
      </div>
      <div className="p-4">
        <div className="flex gap-1">
      <Statistic title="Active Users" value={112893} />
      <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
      <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
      <Statistic title="Unmerged" value={93} suffix="/ 100" />
      <Card bordered={false}>
        <Statistic
          title="Active"
          value={11.28}
          precision={2}
          valueStyle={{
            color: '#3f8600',
          }}
          prefix={<ArrowUpOutlined />}
          suffix="%"
        />
      </Card>
      </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
