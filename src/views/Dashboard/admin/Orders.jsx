import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  get_admin_orders,
  hand_over_orders_to_shipper,
  messageClear,
} from "../../../redux/store/reducers/orderReducer";
import debounce from "lodash.debounce";
import { formatCurrency } from "../../../utils";
import { get_all_shippers } from "../../../redux/store/reducers/shipperReducer";
import toast from "react-hot-toast";

const orderStatus = {
  pending: <span className="badge badge-warning">Chờ xác nhận</span>,
  processing: <span className="badge badge-info">Đang xử lý</span>,
  shipped: <span className="badge badge-success">Đã bàn giao</span>,
  delivered: <span className="badge badge-success">Đang giao hàng</span>,
  completed: <span className="badge badge-success">Giao thành công</span>,
  cancelled: <span className="badge badge-danger">Đã hủy</span>,
  returned: <span className="badge badge-danger">Hoàn trả</span>,
};

const Orders = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [status, setStatus] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showShipperModal, setShowShipperModal] = useState(false);
  const [expandedShopIds, setExpandedShopIds] = useState([]);

  const { myOrders, totalOrder, successMessage } = useSelector(
    (state) => state.order
  );
  const { shippers } = useSelector((state) => state.shipper);

  // Debounce function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      const params = {
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
      };
      dispatch(get_admin_orders(params));
    }, 300),
    [dispatch, parPage, currentPage]
  );

  useEffect(() => {
    dispatch(get_admin_orders({ parPage: parseInt(parPage), page: 1 }));
  }, [dispatch]);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    dispatch(get_all_shippers());
  }, [dispatch]);

  useEffect(() => {
    debouncedSearch(searchValue, status);
    return debouncedSearch.cancel;
  }, [searchValue, status, debouncedSearch]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const handleHandOverToShipper = (shipperId) => {
    dispatch(
      hand_over_orders_to_shipper({
        shipperId,
        orderIds: selectedOrders,
      })
    );
    setShowShipperModal(false);
    setSelectedOrders([]);
  };

  const toggleShopDropdown = (shopId) => {
    setExpandedShopIds((prevIds) =>
      prevIds.includes(shopId)
        ? prevIds.filter((id) => id !== shopId)
        : [...prevIds, shopId]
    );
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-base-100 shadow-md rounded-md">
        <div className="flex justify-between items-center mb-4">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="px-4 py-2 border border-slate-700 rounded-md shadow-md"
            type="text"
            placeholder="Search"
          />
        </div>

        <div className="relative overflow-x-auto">
          <table className="table w-full text-sm text-left">
            <thead>
              <tr>
                <th className="py-3 w-[5%] font-bold">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allOrderIds = myOrders.flatMap((shop) =>
                          shop.orders.map((order) => order._id)
                        );
                        setSelectedOrders(allOrderIds);
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    checked={
                      selectedOrders.length > 0 &&
                      selectedOrders.length ===
                        myOrders.flatMap((shop) => shop.orders).length
                    }
                  />
                </th>
                <th className="py-3 w-[25%] font-bold">Order ID</th>
                <th className="py-3 w-[13%] font-bold">Total Price</th>
                <th className="py-3 w-[18%] font-bold">Payment Status</th>
                <th className="py-3 w-[18%] font-bold">Order Status</th>
                <th className="py-3 w-[18%] text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.length > 0 ? (
                myOrders?.map((shop) => (
                  <React.Fragment key={shop._id}>
                    <tr>
                      <td
                        colSpan={6}
                        className="py-3 font-bold text-2xl cursor-pointer"
                        onClick={() => toggleShopDropdown(shop._id)}
                      >
                        {shop.shopName}
                        <span className="ml-2">
                          {expandedShopIds.includes(shop._id) ? "▲" : "▼"}
                        </span>
                      </td>
                    </tr>
                    {expandedShopIds.includes(shop._id) &&
                      shop.orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-slate-700"
                        >
                          <td className="py-3 w-[25%] font-medium whitespace-nowrap">
                            #{order._id}
                          </td>
                          <td className="py-3 w-[13%] font-medium">
                            {formatCurrency(order.totalPrice)}
                          </td>
                          <td className="py-3 w-[18%] font-medium">
                            {order.paymentStatus === "paid" ? (
                              <span className="badge badge-success">
                                Đã thanh toán
                              </span>
                            ) : (
                              <span className="badge badge-error">
                                Chưa thanh toán
                              </span>
                            )}
                          </td>
                          <td className="py-3 w-[18%] font-medium">
                            {orderStatus[order.orderStatus]}
                          </td>
                          <td className="py-3 w-[20%] text-center font-medium">
                            <Link
                              to={`/admin/dashboard/order/details/${order._id}`}
                              className="btn btn-sm btn-primary rounded-full"
                            >
                              Chi tiết
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 font-bold text-2xl text-center"
                  >
                    Không có đơn hàng nào cần bàn giao
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          perPage={parPage}
          total={totalOrder}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Orders;
