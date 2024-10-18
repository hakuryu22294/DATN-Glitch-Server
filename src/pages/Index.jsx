import { useEffect } from "react";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { get_dashboard_index_data } from "../redux/store/reducers/userDashboardReducer";
import { formatCurrency } from "../utils";
import { FaFile, FaPaypal } from "react-icons/fa";
import {
  FaFileCircleCheck,
  FaFileCircleMinus,
  FaFileCircleQuestion,
} from "react-icons/fa6";
import { get_customer_wallet } from "../redux/store/reducers/homeReducer";

const paymentStatus = {
  paid: {
    text: "Đã thanh toán",
    color: "text-green-500",
  },
  unpaid: {
    text: "Chưa thanh toán",
    color: "text-red-500",
  },
};

const orderStatus = {
  pending: {
    text: "Chờ xác nhận",
    color: "text-yellow-500",
  },
  processing: {
    text: "Đang xử lý",
    color: "text-blue-500",
  },
  completed: {
    text: "Đã giao",
    color: "text-green-500",
  },
  cancelled: {
    text: "Đã hủy",
    color: "text-red-500",
  },
};

const deliveryStatus = {
  not_assigned: {
    text: "Chờ bàn giao",
    color: "text-yellow-500",
  },
  assigned: {
    text: "Đã nhận",
    color: "text-blue-500",
  },
  delivered: {
    text: "Đã giao",
    color: "text-green-500",
  },
  cancelled: {
    text: "Đã huỷ",
    color: "text-red-500",
  },
};
const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { recentOrders, totalOrder, pendingOrder, cancelledOrder } =
    useSelector((state) => state.userDashboard);
  const { customerWallet } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(get_dashboard_index_data(userInfo.id));
  }, [dispatch, userInfo.id]);
  useEffect(() => {
    dispatch(get_customer_wallet({ customerId: userInfo.id }));
  }, [dispatch, userInfo.id]);
  const redirect = (ord) => {
    let items = 0;
    for (let i = 0; i < ord.length; i++) {
      items = ord.products[i].quantity + items;
    }
    navigate("/payment", {
      state: {
        price: ord.totalPrice,
        items,
        orderId: ord._id,
      },
    });
  };
  console.log(customerWallet);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex justify-center items-center p-5 bg-base-300 shadow-md rounded-md gap-5">
          <div className="bg-primary w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl">
            <span className="text-xl text-base-content">
              <FaFile />
            </span>
          </div>
          <div className="flex flex-col justify-start items-start ">
            <h2 className="text-3xl font-bold">{totalOrder}</h2>
            <span>Orders </span>
          </div>
        </div>

        <div className="flex justify-center items-center p-5 bg-base-300 shadow-md rounded-md gap-5">
          <div className="bg-warning w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl">
            <span className="text-xl text-warning-content">
              <FaFileCircleQuestion />
            </span>
          </div>
          <div className="flex flex-col justify-start items-start text-base-content">
            <h2 className="text-3xl font-bold">{pendingOrder}</h2>
            <span>Pending Orders </span>
          </div>
        </div>

        <div className="flex justify-center items-center p-5 bg-base-300 shadow-md rounded-md gap-5">
          <div className="bg-error w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl">
            <span className="text-xl text-error-content">
              <FaFileCircleMinus />
            </span>
          </div>
          <div className="flex flex-col justify-start items-start text-base-content">
            <h2 className="text-3xl font-bold">{cancelledOrder}</h2>
            <span>Cancelled Orders </span>
          </div>
        </div>
        <div className="flex justify-center items-center p-5 bg-base-300 shadow-md rounded-md gap-5">
          <div className="bg-green-100 w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl">
            <span className="text-xl text-primary">
              <FaPaypal />
            </span>
          </div>
          <div className="flex flex-col justify-start items-start text-base-content">
            <h2 className="text-3xl font-bold">
              {formatCurrency(customerWallet)}
            </h2>
            <span>Wallet </span>
          </div>
        </div>
      </div>

      <div className="bg-base-300 p-5 mt-5 rounded-md">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <div className="pt-4">
          <div className="relative overflow-x-auto rounded-md">
            <table className="w-full table text-sm text-left text-gray-500">
              <thead className="text-xs uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Order Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Orders Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Delivery Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((o, i) => (
                  <tr
                    key={i}
                    className="border-b bg-base-200 hover:bg-base-300"
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      #{o._id}
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {formatCurrency(o.totalPrice)}
                    </td>
                    <td
                      className={`px-6 py-4 font-medium whitespace-nowrap ${
                        paymentStatus[o.paymentStatus]?.color
                      }`}
                    >
                      {paymentStatus[o.paymentStatus]?.text || o.paymentStatus}
                    </td>
                    <td
                      className={`px-6 py-4 font-medium whitespace-nowrap ${
                        orderStatus[o.orderStatus]?.color
                      }`}
                    >
                      {orderStatus[o.orderStatus]?.text || o.orderStatus}
                    </td>
                    <td
                      className={`px-6 py-4 font-medium whitespace-nowrap ${
                        deliveryStatus[o.deliveryStatus]?.color
                      }`}
                    >
                      {deliveryStatus[o.deliveryStatus]?.text ||
                        o.deliveryStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/dashboard/order/details/${o._id}`}
                        className="btn btn-info btn-sm mr-2"
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
    </div>
  );
};

export default Index;
