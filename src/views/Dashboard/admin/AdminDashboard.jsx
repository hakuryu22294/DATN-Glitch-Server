import { useEffect } from "react";
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import avtDefault from "../../../assets/user.png";

import moment from "moment";
import { get_admin_dashboard_data } from "../../../redux/store/reducers/dashboardReducer";
import { formatCurrency } from "../../../utils";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSale,
    totalOrder,
    totalProduct,
    totalSeller,
    recentOrder,
    recentMessage,
  } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);
  console.log(totalProduct);
  useEffect(() => {
    dispatch(get_admin_dashboard_data());
  }, []);

  const state = {
    series: [
      {
        name: "Orders",
        data: Array.isArray(totalOrder) ? totalOrder : [], // Ensure it's an array
      },
      {
        name: "Revenue",
        data: Array.isArray(totalSale) ? totalSale : [], // Ensure it's an array
      },
      {
        name: "Sellers",
        data: Array.isArray(totalSeller) ? totalSeller : [], // Ensure it's an array
      },
    ],
    options: {
      colors: ["#181ee8", "#f00", "#0f0"],
      plotOptions: {
        line: {
          curve: "smooth",
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
        colors: "#f0f0f0",
        width: 2,
        dashArray: 0,
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Update categories as needed
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
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            chart: {
              height: "550px",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="md:px-2 px-7 py-5">
      <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 grid-cols-4 gap-7">
        <div className="flex shadow-md justify-between items-center p-5 bg-white rounded-md gap-3">
          <div className="flex  flex-col justify-start items-start text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">{formatCurrency(totalSale)}</h2>
            <span className="text-md font-medium">Total Salse</span>
          </div>

          <div className="w-[40px] h-[47px]  rounded-full bg-[#3e68f1] flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>

        <div className="flex shadow-md justify-between items-center p-5 bg-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">{totalProduct}</h2>
            <span className="text-md font-medium">Products</span>
          </div>

          <div className="w-[40px] h-[47px] rounded-full bg-[#3e68f1] flex justify-center items-center text-xl">
            <MdProductionQuantityLimits className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>

        <div className="flex justify-between shadow-md items-center p-5 bg-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">{totalSeller}</h2>
            <span className="text-md font-medium">Sellers</span>
          </div>

          <div className="w-[40px] h-[47px] rounded-full bg-[#3e68f1] flex justify-center items-center text-xl">
            <FaUsers className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>

        <div className="flex justify-between shadow-md items-center p-5 bg-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">{totalOrder}</h2>
            <span className="text-md font-medium">Orders</span>
          </div>

          <div className="w-[40px] h-[47px] rounded-full bg-[#3e68f1] flex justify-center items-center text-xl">
            <FaCartShopping className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap mt-7">
        <div className="w-full lg:w-7/12 lg:pr-3">
          <div className="w-full bg-white shadow-md p-4 rounded-md">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div>

        <div className="w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0">
          <div className="w-full bg-white shadow-md p-4 rounded-md text-[#d0d2d6]">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3">
                Recent Seller Message
              </h2>
              <Link className="font-semibold text-sm text-[#d0d2d6]">
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-2 pt-6 text-[#d0d2d6]">
              <ol className="relative border-1 border-slate-600 ml-4">
                {recentMessage?.map((m, i) => (
                  <li key={i} className="mb-3 ml-6">
                    <div className="flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#4c7fe2] rounded-full z-10">
                      {m.senderId === userInfo._id ? (
                        <img
                          className="w-full rounded-full h-full shadow-lg"
                          src={userInfo?.image}
                          alt=""
                        />
                      ) : (
                        <img
                          className="w-full rounded-full h-full shadow-lg"
                          src={avtDefault}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Link className="text-md font-normal">
                          {m.senderName}
                        </Link>
                        <time className="mb-1 text-sm font-normal sm:order-last sm:mb-0">
                          {" "}
                          {moment(m.createdAt).startOf("hour").fromNow()}
                        </time>
                      </div>
                      <div className="p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800">
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

      <div className="w-full p-4 bg-white shadow-md  rounded-md mt-6">
        <div className="flex  justify-between items-center">
          <h2 className="font-semibold text-lg pb-3 ">Recent Orders</h2>
          <Link className="font-semibold text-sm text-[#d0d2d6]">View All</Link>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-sm  uppercase border-b border-slate-700">
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
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    #{d._id}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    ${d.price}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    {d.payment_status}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    {d.delivery_status}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <Link to={`/admin/dashboard/order/details/${d._id}`}>
                      View
                    </Link>{" "}
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
