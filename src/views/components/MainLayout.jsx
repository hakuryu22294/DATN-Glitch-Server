import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";

const MainLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="md:ml-0 ml-[360px] pt-[95px] transition-all">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
