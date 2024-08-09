import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_admin_orders } from "../../../redux/store/reducers/orderReducer";
import debounce from "lodash.debounce";

const Orders = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [status, setStatus] = useState("");

  const { myOrders, totalOrder } = useSelector((state) => state.order);

  // Debounce function
  const debouncedSearch = useCallback(
    debounce((searchValue, status) => {
      const params = {
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
        status,
      };
      dispatch(get_admin_orders(params));
    }, 300),
    [dispatch, parPage, currentPage]
  );

  useEffect(() => {
    debouncedSearch(searchValue, status);
    return debouncedSearch.cancel;
  }, [searchValue, status, debouncedSearch]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="lg:px-2 px-7 pt-5">
      <div className="w-full p-4 bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center mb-4">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="px-4 py-2 border border-slate-700 rounded-md shadow-md"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>

          <select
            onChange={handleStatusChange}
            value={status}
            className="px-4 py-2 border border-slate-700 rounded-md shadow-md"
          >
            <option value="">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="px-4 py-2 border border-slate-700 rounded-md shadow-md"
            type="text"
            placeholder="Search"
          />
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 w-[25%] font-bold">Order ID</th>
                <th className="py-3 w-[13%] font-bold">Total Price</th>
                <th className="py-3 w-[18%] font-bold">Payment Status</th>
                <th className="py-3 w-[18%] font-bold">
                  <select
                    onChange={handleStatusChange}
                    value={status}
                    className="w-full px-4 py-2 border border-slate-700 rounded-md shadow-md"
                  >
                    <option value="">All Statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </th>
                <th className="py-3 w-[18%] font-bold">Delivery Status</th>
                <th className="py-3 w-[18%] font-bold">Action</th>
                <th className="py-3 w-[8%] font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {myOrders?.map((shop) => (
                <React.Fragment key={shop._id}>
                  <tr>
                    <td
                      colSpan={6}
                      className="py-3 font-bold border-b border-slate-700"
                    >
                      {shop.shopName}
                    </td>
                  </tr>
                  {shop.orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 w-[25%] font-medium whitespace-nowrap">
                          #{order._id}
                        </td>
                        <td className="py-3 w-[13%] font-medium">
                          ${order.totalPrice}
                        </td>
                        <td className="py-3 w-[18%] font-medium">
                          {order.paymentStatus}
                        </td>
                        <td className="py-3 w-[18%] font-medium">
                          {order.orderStatus}
                        </td>
                        <td className="py-3 w-[18%] font-medium">
                          {order.deliveryStatus}
                        </td>
                        <td className="py-3 w-[18%] font-medium">
                          <Link
                            to={`/admin/dashboard/order/details/${order._id}`}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {totalOrder > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
