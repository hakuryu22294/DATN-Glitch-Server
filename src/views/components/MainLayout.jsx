import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";

const MainLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="w-full h-screen">
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="ml-0 bg-base-200 lg:ml-[300px] pt-10 min-h-screen transition-all">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
