import { useState } from "react";

import { FaList } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoIosHome } from "react-icons/io";
import { FaBorderAll } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import instanceApi from "../configs/api.config";

const paymentStatus = {
  paid: {
    text: "Đã thanh toán",
    color: "text-green-500",
  },
  unpaid: {
    text: "Chưa thanh toán",
    color: "text-red-500",
  },
};

const orderStatus = {
  pending: {
    text: "Chờ xác nhận",
    color: "text-yellow-500",
  },
  processing: {
    text: "Đang xuất bán",
    color: "text-blue-500",
  },
  completed: {
    text: "Đã giao",
    color: "text-green-500",
  },
  cancelled: {
    text: "Đã huỷ",
    color: "text-red-500",
  },
};
const Dashboard = () => {
  const [filterShow, setFilterShow] = useState(false);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { data } = await instanceApi.get("/customer/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("shopInfo");
      navigate("/login");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <div className="mt-5">
        <div className="w-[90%] mx-auto block md:hidden">
          <div>
            <button
              onClick={() => setFilterShow(!filterShow)}
              className="text-center py-3 px-3 bg-primary text-base-content rounded-md"
            >
              <FaList />{" "}
            </button>
          </div>
        </div>

        <div className="h-full mx-auto">
          <div className="py-5 w-[90%] md:flex mx-auto relative">
            <div
              className={`rounded-md z-50 base absolute md:static ${
                filterShow ? "-left-4" : "-left-[360px]"
              } w-[270px] ml-4 bg-base-300 shadow-md h-full`}
            >
              <ul className="py-2 text-base-content px-4">
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <IoIosHome />
                  </span>
                  <Link to="/dashboard" className="block">
                    Dashboard{" "}
                  </Link>
                </li>
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <FaBorderAll />
                  </span>
                  <Link to="/dashboard/my-orders" className="block">
                    My Orders{" "}
                  </Link>
                </li>
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <FaHeart />
                  </span>
                  <Link to="/dashboard/my-wishlist" className="block">
                    Wishlist{" "}
                  </Link>
                </li>
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <RiLockPasswordLine />
                  </span>
                  <Link to="/dashboard/change-password" className="block">
                    Change Password{" "}
                  </Link>
                </li>
                <li
                  onClick={logout}
                  className="flex justify-start items-center gap-2 py-2 cursor-pointer"
                >
                  <span className="text-xl">
                    <IoMdLogOut />
                  </span>
                  <div className="block">Logout </div>
                </li>
              </ul>
            </div>

            <div className="w- full md:w-[calc(100%-270px)]">
              <div className="mx-4 md-lg:mx-0">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
