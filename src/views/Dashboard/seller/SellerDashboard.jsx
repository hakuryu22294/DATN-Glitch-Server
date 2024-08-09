import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  get_daily_stats,
  get_seller_dashboard_data,
} from "../../../redux/store/reducers/dashboardReducer";
import { useEffect } from "react";
import { formatCurrency } from "../../../utils";
import sellerDefault from "../../../assets/seller.png";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSale,
    totalOrder,
    totalProduct,
    totalPendingOrder,
    recentOrder,
    recentMessage,
    dailyStats,
  } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(get_daily_stats());
  }, [dispatch]);
  useEffect(() => {
    dispatch(get_seller_dashboard_data());
  }, [dispatch]);
  const dayOfWeek = dailyStats.map((stat) => stat.date);
  const totalSales = dailyStats.map((stat) => stat.totalAmount);
  const totalOrders = dailyStats.map((stat) => stat.totalOrders);

  const state = {
    series: [
      {
        name: "Orders",
        data: totalOrders,
      },

      {
        name: "Sales",
        data: totalSales,
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
    <div className="md:px-4 px-6 py-6 bg-gray-100">
      <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 grid-cols-4 gap-6">
        <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-gray-700">
            <h2 className="text-3xl font-semibold">
              {formatCurrency(totalSale)}
            </h2>
            <span className="text-md font-medium">Total Sales</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-600 flex justify-center items-center text-xl text-white">
            <MdCurrencyExchange />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-gray-700">
            <h2 className="text-3xl font-semibold">{totalProduct}</h2>
            <span className="text-md font-medium">Products</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-800 flex justify-center items-center text-xl text-white">
            <MdProductionQuantityLimits />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-gray-700">
            <h2 className="text-3xl font-semibold">{totalOrder}</h2>
            <span className="text-md font-medium">Orders</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500 flex justify-center items-center text-xl text-white">
            <FaCartShopping />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col justify-start items-start text-gray-700">
            <h2 className="text-3xl font-semibold">{totalPendingOrder}</h2>
            <span className="text-md font-medium">Pending Orders</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-700 flex justify-center items-center text-xl text-white">
            <FaCartShopping />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap mt-6">
        <div className="lg:w-full w-7/12 pr-4">
          <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <Chart
              options={state.options}
              series={state.series}
              type="line"
              height={350}
            />
          </div>
        </div>

        <div className="lg:w-full w-5/12 pl-4 lg:mt-6 mt-0">
          <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-700">
                Recent Customer Messages
              </h2>
              <Link className="font-semibold text-sm text-blue-600">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-4 pt-4 text-gray-700">
              <ol className="relative border-l border-gray-300 ml-4">
                {recentMessage?.map((m, i) => (
                  <li key={i} className="mb-4">
                    <div className="flex absolute -left-6 shadow-md justify-center items-center w-12 h-12 p-2 bg-blue-500 rounded-full z-10">
                      <img
                        className="w-full rounded-full h-full shadow-md"
                        src={
                          m.senderId === userInfo._id
                            ? userInfo.image
                            : sellerDefault
                        }
                        alt=""
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Link className="text-md font-normal">
                          {m.senderName}
                        </Link>
                        <time className="text-sm font-normal">
                          {moment(m.createdAt).startOf("hour").fromNow()}
                        </time>
                      </div>
                      <div className="p-2 text-xs font-normal bg-gray-100 rounded-lg border border-gray-200">
                        {m.message}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-6 bg-white rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-700">Recent Orders</h2>
          <Link className="font-semibold text-sm text-blue-600">View All</Link>
        </div>
        <div className="relative overflow-x-auto mt-4">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-sm text-gray-700 uppercase border-b border-gray-300">
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
                <th scope="col" className="py-3 px-4">
                  Active
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrder?.map((d, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    #{d._id}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {formatCurrency(d.price)}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {d.payment_status}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {d.delivery_status}
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
