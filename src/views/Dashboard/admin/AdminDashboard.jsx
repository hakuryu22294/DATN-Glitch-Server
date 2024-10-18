import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import avtDf from "../../../assets/avt.png";
import moment from "moment";
import DatePicker from "react-datepicker";
import {
  get_admin_dashboard_data,
  get_daily_platform_wallet_stats,
  get_top_seller_dashboard,
} from "../../../redux/store/reducers/dashboardReducer";
import { formatCurrency } from "../../../utils";
import "react-datepicker/dist/react-datepicker.css";
import { FaLocationDot, FaStar } from "react-icons/fa6";
const getDaysOfWeek = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days;
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0); // State to control active tab

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  const {
    totalSale,
    dailyProductsSold,
    dailyOrders,
    completedOrders,
    recentOrders,
    dailyStats,
    sellerTop,
  } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);
  const dayOfWeek = getDaysOfWeek();

  // Map daily stats to corresponding days of the week
  const platFormDailyStats = dayOfWeek.map((day) => {
    const stat = dailyStats?.find((s) => moment(s.date).format("dddd") === day);
    return stat ? stat.totalAmount : 0;
  });
  useEffect(() => {
    dispatch(get_top_seller_dashboard());
  }, [dispatch]);
  useEffect(() => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    dispatch(get_admin_dashboard_data({ date: formattedDate }));
  }, [dispatch, selectedDate]);
  useEffect(() => {
    dispatch(get_daily_platform_wallet_stats());
  }, [dispatch]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const state = {
    series: [
      {
        name: "Tổng doanh thu",
        data: platFormDailyStats,
      },
    ],
    options: {
      colors: ["#1E90FF"],
      plotOptions: {
        line: {
          curve: "smooth",
          width: 2,
        },
      },
      chart: {
        background: "transparent",
        foreColor: "#d0d2d6",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: "smooth",
        lineCap: "butt",
        width: 2,
        dashArray: 0,
      },
      xaxis: {
        categories: dayOfWeek, // Update categories as needed
        labels: {
          rotate: -45,
        },
      },
      legend: {
        position: "top",
      },
      responsive: [
        {
          breakpoint: 565,
          options: {
            chart: {
              height: "550px",
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
          },
        },
      ],
    },
  };
  const { topRevenueSellers, topRatedSellers } = sellerTop;
  const renderTopSellers = () => {
    const sellers = activeTab === 0 ? topRatedSellers : topRevenueSellers;

    return (
      <div className="space-y-4">
        {sellers?.map((seller, i) => (
          <div
            key={i}
            className="bg-base-100 p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="flex items-center">
              <div className="ml-4">
                <div className="flex items-center gap-3">
                  <img
                    className="w-16 h-16 rounded-full shadow-lg"
                    src={
                      (activeTab === 0
                        ? seller?.avatar
                        : seller?.shopInfo.avatar) || avtDf
                    }
                    alt=""
                  />
                  <div>
                    <h3 className="font-semibold text-md">
                      {seller?.shopInfo?.shopName}
                    </h3>
                    <p className="flex gap-2 items-center text-sm font-semibold text-primary">
                      <FaLocationDot /> {seller.shopInfo.address}
                    </p>
                  </div>
                </div>
                {/* Nếu là tab topRevenue thì hiển thị totalRevenue */}
              </div>
            </div>
            {/* Hiển thị thông tin khác nhau tùy theo tab */}
            <span className="font-medium text-primary">
              {activeTab === 0 ? (
                <span className="flex items-center gap-2">
                  {seller.shopRatting}
                  <FaStar />
                </span>
              ) : (
                <span>Đóng góp: {formatCurrency(seller.totalRevenue)}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-2 bg-base-200 lg:px-7 t py-5">
      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          maxDate={new Date()}
          onChange={handleDateChange}
          value={selectedDate}
          format="yyyy-MM-dd"
          className="bg-base-300 border border-gray-300 text-base-content text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-7">
        <div className="flex shadow-md justify-between items-center p-5 bg-primary text-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{formatCurrency(totalSale)}</h2>
            <span className="text-md font-medium">Doanh thu sàn</span>
          </div>
        </div>

        <div className="flex shadow-md justify-between items-center p-5 bg-secondary text-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{dailyProductsSold}</h2>
            <span className="text-md font-medium">Sản phẩm bán trong ngày</span>
          </div>
        </div>

        <div className="flex justify-between shadow-md items-center p-5 bg-success text-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{dailyOrders}</h2>
            <span className="text-md font-medium">Đơn trong ngày</span>
          </div>
        </div>

        <div className="flex justify-between shadow-md items-center p-5 bg-warning text-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{completedOrders}</h2>
            <span className="text-md font-medium">Đơn hoàn thành</span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap mt-7">
        <div className="w-full lg:w-7/12 lg:pr-3">
          <div className="w-full bg-base-100 shadow-md p-4 rounded-md">
            <Chart
              options={state.options}
              series={state.series}
              type="line"
              height={350}
            />
          </div>
        </div>
        <div className="bg-base-100 lg:w-5/12  rounded-lg shadow-md p-6">
          {/* DaisyUI Tabs */}
          <div role="tablist" className="tabs tabs-lifted">
            <button
              className={`tab tab-bordered ${
                activeTab === 0 ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(0)}
            >
              Top Rated Seller
            </button>
            <button
              className={`tab tab-bordered ${
                activeTab === 1 ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(1)}
            >
              Top Đóng Góp
            </button>
          </div>

          {/* Top Products Content */}
          <div className="mt-4">{renderTopSellers()}</div>
        </div>
      </div>

      <div className="w-full p-4 bg-base-100 shadow-md rounded-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg pb-3">Recent Orders</h2>
          <Link className="font-semibold text-sm text-base-content">
            View All
          </Link>
        </div>

        <div className="relative overflow-x-auto">
          <table className="table text-base-content w-full text-sm text-left">
            <thead className="text-sm uppercase border">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Order Id
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Payment Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Order Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order) => (
                <tr key={order._id} className="border-b border-slate-600">
                  <th
                    scope="row"
                    className="py-3 px-4 font-medium text-base-content"
                  >
                    {order._id}
                  </th>
                  <td className="py-3 px-4 font-normal text-base-content">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-3 px-4 font-normal text-base-content">
                    {order.paymentStatus}
                  </td>
                  <td className="py-3 px-4 font-normal text-base-content">
                    {order.orderStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
