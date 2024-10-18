import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  get_seller_orders,
  accept_orders,
  hand_over_orders_to_shipper,
  messageClear,
} from "../../../redux/store/reducers/orderReducer";
import Pagination from "../../Pagination";
import { formatCurrency } from "../../../utils";
import { get_all_shippers } from "../../../redux/store/reducers/shipperReducer";
import toast from "react-hot-toast";

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

const deliveryStatus = {
  not_assigned: {
    text: "Chưa bàn giao",
    color: "text-yellow-500",
  },
  assigned: {
    text: "Đã bàn giao",
    color: "text-blue-500",
  },
  delivered: {
    text: "Đã giao",
    color: "text-green-500",
  },
  canceled: {
    text: "Đã huỷ",
    color: "text-red-500",
  },
};

const Orders = () => {
  const dispatch = useDispatch();
  const { shopOrders, totalOrder, successMessage, errorMessage } = useSelector(
    (state) => state.order
  );
  console.log(totalOrder);
  const { shippers } = useSelector((state) => state.shipper);
  const { shopInfo } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(40);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showShipperModal, setShowShipperModal] = useState(false); // Modal visibility state
  const [selectedShipper, setSelectedShipper] = useState(null); // Selected Shipper state

  useEffect(() => {
    dispatch(get_all_shippers({ shopAddress: shopInfo.shopInfo.address }));
  }, [dispatch, shopInfo.shopInfo.address]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      sellerId: shopInfo._id,
      orderStatus: selectedStatus,
    };
    dispatch(get_seller_orders(obj));
  }, [searchValue, currentPage, parPage, dispatch, shopInfo, selectedStatus]);
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleOrderAction = () => {
    dispatch(accept_orders({ orderIds: selectedOrders }));
    setSelectedOrders([]);
  };
  const confirmHandOver = () => {
    if (selectedShipper) {
      dispatch(
        hand_over_orders_to_shipper({
          orderIds: selectedOrders,
          shipperId: selectedShipper._id,
        })
      );
      setShowShipperModal(false);
      setSelectedOrders([]);
    }
  };
  const handOverToShipper = () => {
    setShowShipperModal(true);
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      dispatch(
        get_seller_orders({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
          sellerId: shopInfo._id,
          orderStatus: selectedStatus,
        })
      );
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [
    successMessage,
    errorMessage,
    dispatch,
    parPage,
    currentPage,
    searchValue,
    shopInfo._id,
    selectedStatus,
  ]);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };
  const isPending = selectedOrders.some(
    (orderId) =>
      shopOrders.find((order) => order._id === orderId)?.orderStatus ===
      "pending"
  );
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleBulkAction = () => {
    const hasPendingOrder = selectedOrders.some(
      (orderId) =>
        shopOrders.find((order) => order._id === orderId)?.orderStatus ===
        "pending"
    );

    if (hasPendingOrder) {
      handleOrderAction();
      setSelectedStatus("processing");
    } else {
      handOverToShipper();
      setSelectedStatus("processing");
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="font-semibold text-2xl mb-3">Quản lý đơn hàng</h1>

      <div className="w-full p-4 bg-base-300 shadow-md rounded-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchValue}
            onChange={handleSearchChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <div className="flex gap-4 mb-4">
            <label key={status} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStatus === "all"}
                onChange={() => handleStatusChange("all")}
                className="checkbox checkbox-primary"
              />
              <span className="text-primary">Tất cả</span>
            </label>
            {Object.keys(orderStatus).map((status) => (
              <label key={status} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedStatus === status}
                  onChange={() => handleStatusChange(status)}
                  className="checkbox checkbox-primary"
                />
                <span className={orderStatus[status]?.color}>
                  {orderStatus[status]?.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full table text-sm text-left">
            <thead className="text-sm uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Select
                </th>
                <th scope="col" className="py-3 px-4">
                  Customer
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
                  Delivery Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Date
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {shopOrders?.map((d, i) => (
                <tr key={d._id}>
                  {d.orderStatus === "processing" ||
                  d.orderStatus === "pending" ? (
                    <input
                      onChange={() => handleCheckboxChange(d._id)}
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      value={d._id}
                      checked={selectedOrders.includes(d._id)}
                    />
                  ) : (
                    <td>{i + 1}</td>
                  )}
                  <td className="py-1 px-4 font-semibold whitespace-nowrap">
                    {d.shippingInfo.name || "Chuyên Boom hàng"}
                  </td>
                  <td className="py-1 px-4 font-semibold whitespace-nowrap">
                    {formatCurrency(d.totalPrice)}
                  </td>
                  <td className="py-1 px-4 font-semibold whitespace-nowrap">
                    <span className={paymentStatus[d.paymentStatus]?.color}>
                      {paymentStatus[d.paymentStatus]?.text}
                    </span>
                  </td>
                  <td className="py-1 px-4 font-semibold whitespace-nowrap">
                    <span className={orderStatus[d.orderStatus]?.color}>
                      {orderStatus[d.orderStatus]?.text}
                    </span>
                  </td>
                  <td className="py-1 px-4 font-semibold whitespace-nowrap">
                    <span className={deliveryStatus[d.deliveryStatus]?.color}>
                      {deliveryStatus[d.deliveryStatus]?.text}
                    </span>
                  </td>
                  <td className="py-1 px-4 font-semibold whitespace-nowrap">
                    {d.orderDate.slice(0, 10)}
                  </td>
                  <td className="py-1 px-4 font-semibold whitespace-nowrap">
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/seller/dashboard/order/details/${d._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Xem
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleBulkAction}
          className="btn btn-primary w-full mt-5"
        >
          {isPending ? "Xác nhận" : "Bàn giao"}
        </button>
      </div>
      {totalOrder > parPage && (
        <Pagination
          total={totalOrder}
          limit={parPage}
          page={currentPage}
          setPage={setCurrentPage}
        />
      )}
      {showShipperModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Chọn shipper</h2>
            <ul className="space-y-2">
              {shippers.map((shipper) => (
                <li
                  key={shipper._id} // Chỉnh sửa key là shipper._id thay vì shipper.id
                  className={`p-2 cursor-pointer border rounded-md ${
                    selectedShipper?._id === shipper._id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedShipper(shipper)}
                >
                  {shipper.name} - {shipper.phone}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowShipperModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={confirmHandOver}
                disabled={!selectedShipper}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
