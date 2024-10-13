import React, { useEffect, useState } from "react";
import { Button, message, Segmented, DatePicker } from "antd";
import {
  getallPurchase,
  getBookWiseMonthlyPurchase,
  getBookWisePurchase,
  getBookWiseYearlyPurchase,
  getMonthlyPurchase,
  getYearlyPurchase,
} from "../Utils/AdminDataApi";
import { MdRefresh } from "react-icons/md";
import AllPurchaseRecordTable from "../Components/AllPurchaseRecordTable";
import BookWiseRecordTable from "../Components/BookWiseRecordTable";

const PurchaseReport = () => {
  const [purchaseData, setPurchaseData] = useState(null);
  const [bookWiseData, setBookWiseData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tabValue, setTabValue] = useState("All");

  const [messageApi, contextHolder] = message.useMessage();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGetAllPurchase = async (type) => {
    messageApi.open({
      type: "loading",
      content: "Loading Purchases..",
      duration: 0,
    });
    let res = null;
    if (selectedDate) {
      if (type == 1) {
        const year = selectedDate.year();
        const month = selectedDate.month() + 1;
        res = await getMonthlyPurchase(year, month);
      } else if (type == 2) {
        const year = selectedDate.year();
        res = await getYearlyPurchase(year);
      } else {
        res = await getallPurchase();
      }
    } else {
      res = await getallPurchase();
    }
    messageApi.destroy();
    if (res) {
      console.log(res.data.Data);
      setPurchaseData(res.data.Data);
    }
  };

  const handleGetBookWisePurchase = async (type) => {
    messageApi.open({
      type: "loading",
      content: "Loading Purchases..",
      duration: 0,
    });
    let res = null;
    if (selectedDate) {
      if (type == 1) {
        const year = selectedDate.year();
        const month = selectedDate.month() + 1;
        console.log(year,month)
        res = await getBookWiseMonthlyPurchase(year, month);
      } else if (type == 2) {
        const year = selectedDate.year();
        res = await getBookWiseYearlyPurchase(year);
      } else {
        res = await getBookWisePurchase();
      }
    } else {
      res = await getBookWisePurchase();
    }
    messageApi.destroy();
    if (res) {
      console.log(res.data.Data);
      setBookWiseData(res.data.Data);
    }
  };

  const refreshData = (type = 0) => {
    handleGetAllPurchase(type);
    handleGetBookWisePurchase(type);
  };

  useEffect(() => {
    refreshData(0);
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-auto">
      {contextHolder}
      <div className="bg-white flex justify-between gap-4 font-bold text-2xl p-4 border-b-[1px] sticky top-0 z-50">
        Purchase Report
        <Segmented
          options={["All", "BookWise"]}
          value={tabValue}
          onChange={setTabValue}
        />
        <div className="flex gap-2">
          <Button shape="circle" onClick={refreshData}>
            <MdRefresh />
          </Button>
          <DatePicker.MonthPicker
            onChange={handleDateChange}
            placeholder="Select Month and Year"
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={()=>refreshData(1)}>Monthly</Button>
          <Button type="default" onClick={()=>refreshData(2)}>Yearly</Button>
        </div>
      </div>
      <div className="p-4">
        {tabValue == "All" ? (
          <AllPurchaseRecordTable purchaseData={purchaseData} />
        ) : (
          <BookWiseRecordTable bookWiseData={bookWiseData} />
        )}
      </div>
    </div>
  );
};

export default PurchaseReport;
