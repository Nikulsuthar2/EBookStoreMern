import React from 'react'
import { message, } from "antd";

const PurchaseReport = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex gap-4 font-bold text-2xl p-4 border-b-[1px] sticky top-0 z-50">
        Purchase Report
      </div>
    </div>
  )
}

export default PurchaseReport