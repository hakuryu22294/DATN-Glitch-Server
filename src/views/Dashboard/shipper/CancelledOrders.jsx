import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_all_orders } from "../../../redux/store/reducers/shipperReducer";
import { formatCurrency } from "../../../utils";
import { Link } from "react-router-dom";

const CancelledOrders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      get_all_orders({
        shipperId: userInfo?.id,
        deliveryStatus: "cancelled",
      })
    );
  }, [dispatch, userInfo]);

  const { ordersCanceled } = useSelector((state) => state.shipper);

  return (
    <div className="p-6 max-w-8xl mx-auto rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Đơn hàng bị hủy</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search by customer name"
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex space-x-4">
          <button className="btn btn-primary">Filter</button>
          <button className="btn btn-outline">Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ordersCanceled?.map((order) => (
          <div
            key={order._id}
            className="card bg-base-100 shadow-lg mb-4 relative"
          >
            <div className="card-body">
              <p className="text-sm">
                <strong>Tên khách hàng:</strong> {order.customerId.name}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {order.shippingInfo.phone}
              </p>
              <p className="text-sm">
                <strong>Địa chỉ nhận hàng: </strong>
                {order.shippingInfo.address +
                  ", " +
                  order.shippingInfo.district +
                  ", " +
                  order.shippingInfo.province}
              </p>
              <p className="text-sm">
                <strong>Cần thanh toán:</strong>
                <span className="ml-2 font-bold text-primary">
                  {order.paymentStatus === "paid"
                    ? "Không thu phí"
                    : formatCurrency(order.totalPrice)}
                </span>
              </p>

              <div className="flex justify-end space-x-2">
                <Link
                  to={"/shipper/dashboard/orders/" + order._id + "/details"}
                  className="btn btn-info"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancelledOrders;
