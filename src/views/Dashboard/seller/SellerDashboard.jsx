import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  get_daily_stats,
  get_seller_dashboard_data,
  get_top_products,
} from "../../../redux/store/reducers/sellerDashboardReducer";
import { formatCurrency, truncate } from "../../../utils";

// Function to get the names of the days of the week
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

const paymentStatus = {
  paid: {
    text: "Đã thanh toán",
    color: "text-green-500",
  },
  unpaid: {
    text: "Chưa thanh toán",
    color: "text-red-500",
  },
};
const orderStatus = {
  pending: {
    text: "Chờ xác nhận",
    color: "text-yellow-500",
  },
  completed: {
    text: "Đã hoàn thành",
    color: "text-green-500",
  },
  cancelled: {
    text: "Đã huỷ",
    color: "text-red-500",
  },
  processing: {
    text: "Đang chuẩn bị",
    color: "text-blue-500",
  },
  waiting_receive: {
    text: "Đang vận chuyển",
    color: "text-yellow-500",
  },
};
const SellerDashboard = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0);
  const { shopInfo } = useSelector((state) => state.auth);
  const {
    dailyStats,
    recentOrder,
    totalSalePerDay,
    totalOrderPerDay,
    totalPendingOrderPerDay,
    totalSoldPerDay,
    topProducts,
  } = useSelector((state) => state.sellerDashboard);
  console.log(recentOrder);
  // Fetch daily stats when the selected date changes
  useEffect(() => {
    dispatch(get_daily_stats());
  }, [dispatch, selectedDate]);
  useEffect(() => {
    dispatch(get_top_products({ sellerId: shopInfo?._id }));
  }, [dispatch, shopInfo]);
  // Fetch seller dashboard data (once on initial render)
  useEffect(() => {
    const formatDate = moment(selectedDate).format("YYYY-MM-DD");
    dispatch(get_seller_dashboard_data({ date: formatDate }));
  }, [dispatch, selectedDate]);

  const dayOfWeek = getDaysOfWeek();

  // Map daily stats to corresponding days of the week
  const salesData = dayOfWeek.map((day) => {
    const stat = dailyStats?.find((s) => moment(s.date).format("dddd") === day);
    return stat ? stat.totalAmount : 0;
  });

  const renderTopProducts = () => {
    const products =
      activeTab === 0
        ? topProducts.topSellingProducts
        : topProducts.topRatedProducts;

    return (
      <div className="space-y-4">
        {products?.map((product, i) => (
          <div
            key={i}
            className="bg-base-100 p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="flex items-center">
              <img
                src={product.images[0]}
                alt={truncate(product.name, 10)}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="ml-4">
                <h3 className="font-semibold text-md">
                  {truncate(product.name, 10)}
                </h3>
                <p className="text-sm font-semibold text-primary">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
            <span className="font-medium text-primary">
              {activeTab === 0
                ? `Sold: ${product.sold}`
                : `Rating: ${product.rating}`}
            </span>
          </div>
        ))}
      </div>
    );
  };
  // Configuration for the chart
  const chartConfig = {
    series: [
      {
        name: "Sales",
        data: salesData,
      },
    ],
    options: {
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
      },
      xaxis: {
        categories: dayOfWeek,
      },
      yaxis: {
        title: {
          text: "Values",
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

  return (
    <div className="md:px-4 px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Seller Dashboard</h1>
        <div className="">
          <label htmlFor="datePicker" className="text-lg font-medium mr-3 ">
            Chọn ngày
          </label>
          <DatePicker
            id="datePicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <div className="flex justify-between items-center p-6 bg-secondary rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-white">
            <h2 className="text-3xl font-semibold">
              {formatCurrency(totalSalePerDay)}
            </h2>
            <span className="text-md font-medium">Tổng doanh số</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-6 bg-accent rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-white">
            <h2 className="text-3xl font-semibold">{totalSoldPerDay}</h2>
            <span className="text-md font-medium">Đã bán</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-6 bg-primary rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-white">
            <h2 className="text-3xl font-semibold">{totalOrderPerDay}</h2>
            <span className="text-md font-medium">Đơn hàng</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-6 bg-warning rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-white">
            <h2 className="text-3xl font-semibold">
              {totalPendingOrderPerDay}
            </h2>
            <span className="text-md font-medium">Đơn hàng chờ xuất</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="w-full hidden md:block h-[400px] col-span-3 bg-base-100 p-6 rounded-lg shadow-md">
          <Chart
            options={chartConfig.options}
            series={chartConfig.series}
            type="line"
            height={350}
          />
        </div>

        <div className="bg-base-100 rounded-lg shadow-md p-6">
          {/* DaisyUI Tabs */}
          <div role="tablist" className="tabs tabs-lifted">
            <button
              className={`tab tab-bordered ${
                activeTab === 0 ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(0)}
            >
              Top Bán Chạy
            </button>
            <button
              className={`tab tab-bordered ${
                activeTab === 1 ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(1)}
            >
              Top Đánh Giá
            </button>
          </div>

          <div className="mt-4">{renderTopProducts()}</div>
        </div>
      </div>

      <div className="w-full p-6 bg-base-100 rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-700">Recent Orders</h2>
          <Link className="font-semibold text-sm text-blue-600">View All</Link>
        </div>
        <div className="relative overflow-x-auto mt-4">
          <table className="table w-full text-sm text-left text-base-content">
            <thead className="text-sm uppercase border-b">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Customer name
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
                <th scope="col" className="py-3 px-4">
                  Active
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrder?.map((d, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {d.customerId.name}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {formatCurrency(d.totalPrice)}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      paymentStatus[d.paymentStatus].color
                    } whitespace-nowrap`}
                  >
                    {paymentStatus[d.paymentStatus].text}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      orderStatus[d.orderStatus].color
                    } whitespace-nowrap`}
                  >
                    {orderStatus[d.orderStatus].text}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <Link
                      to={`/seller/dashboard/order/details/${d._id}`}
                      className="text-blue-600"
                    >
                      View
                    </Link>
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

export default SellerDashboard;
