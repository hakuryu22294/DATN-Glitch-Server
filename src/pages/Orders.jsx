import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { get_orders } from "../redux/store/reducers/orderReducer";
import { formatCurrency } from "../utils";
import Pagination from "../views/Pagination";

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
  waiting_receive: {
    text: "Đợi nhận hàng",
    color: "text-blue-500",
  },
};

const deliveryStatus = {
  not_assigned: {
    text: "Chưa bàn giao",
    color: "text-yellow-500",
  },
  assigned: {
    text: "Đã nhận",
    color: "text-blue-500",
  },
  delivered: {
    text: "Giao thành công",
    color: "text-green-500",
  },
  cancelled: {
    text: "Đã huỷ",
    color: "text-red-500",
  },
};
const Orders = () => {
  const [state, setState] = useState("all");
  const [pageNumber, setPageNumber] = useState(1); // Page number state
  const parPage = 10; // Number of items per page

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(get_orders({ status: state, userId: userInfo.id }));
  }, [state, dispatch, userInfo.id]);

  // Pagination Logic
  const totalItem = myOrders?.length || 0;
  const startIdx = (pageNumber - 1) * parPage;
  const currentOrders = myOrders?.slice(startIdx, startIdx + parPage);
  return (
    <div className=" p-4 rounded-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-base-content">My Orders </h2>
        <select
          className="outline-none px-3 py-1 border rounded-md text-base-content"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="all">--ordre status--</option>
          <option value="pending">Pending</option>
          <option value="processing">Processcing</option>
          <option value="cancelled">Cancelled</option>
          <option value="waiting_receive">Waiting receive</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="pt-4">
        <div className="relative overflow-x-auto bg-base-300 rounded-md">
          <table className="w-full table text-sm text-left text-base-content">
            <thead className="text-xs  uppercase">
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
                  Order Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Delivery Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Order Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders?.map((o, i) => (
                <tr key={i} className="bg-base-300 border-b">
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    #{o._id}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {formatCurrency(o.totalPrice)}
                  </td>
                  <td
                    scope="row"
                    className={`px-6 py-4 font-bold whitespace-nowrap ${
                      paymentStatus[o.paymentStatus]?.color
                    }`}
                  >
                    {paymentStatus[o.paymentStatus]?.text || o.paymentStatus}
                  </td>
                  <td
                    scope="row"
                    className={`px-6 py-4 font-bold whitespace-nowrap ${
                      orderStatus[o.orderStatus]?.color
                    }`}
                  >
                    {orderStatus[o.orderStatus]?.text || o.orderStatus}
                  </td>
                  <td
                    scope="row"
                    className={`px-6 py-4 font-bold whitespace-nowrap ${
                      deliveryStatus[o.deliveryStatus]?.color
                    }`}
                  >
                    {deliveryStatus[o.deliveryStatus]?.text || o.deliveryStatus}
                  </td>
                  <td
                    scope="row"
                    className={`px-6 py-4 font-bold whitespace-nowrap `}
                  >
                    {o.orderDate.slice(0, 10)}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    <Link to={`/dashboard/order/details/${o._id}`}>
                      <span className="btn btn-sm btn-info">View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Component */}
          <div className="flex justify-center py-4">
            <Pagination
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalItem={totalItem}
              parPage={parPage}
              showItem={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
