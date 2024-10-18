import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  get_seller_order,
  messageClear,
  cancel_order,
} from "../../../redux/store/reducers/orderReducer";
import toast from "react-hot-toast";
import moment from "moment";
import { formatCurrency } from "../../../utils";

// Order Statuses

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [orderId, dispatch]);

  const { shopOrder, errorMessage, successMessage } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    setStatus(shopOrder?.orderStatus);
  }, [shopOrder]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Shipping Information
  let combinatedAddress = `${shopOrder?.shippingInfo?.address}, ${shopOrder?.shippingInfo?.ward}, ${shopOrder?.shippingInfo?.district}, ${shopOrder?.shippingInfo?.province}`;
  let customerPhone = shopOrder?.shippingInfo?.phone;
  let customerName = shopOrder?.shippingInfo?.name;
  const handleCancel = (orderId) => {
    dispatch(cancel_order({ orderId }));
    navigate("/seller/dashboard/orders");
  };
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-base-300 shadow-md rounded-md">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
        </div>

        <div className="p-4">
          <div className="flex gap-2 text-lg ">
            <h2>Order ID: #{shopOrder._id}</h2>
            <span>{moment(shopOrder.orderDate).format("DD/MM/YYYY")}</span>
          </div>

          <div className="flex flex-wrap gap-8 mt-5">
            {/* Customer Information */}
            <div className="w-full lg:w-1/2 p-3 rounded-md bg-base-100">
              <div className="pr-3 text-lg">
                <h2 className="pb-2 font-semibold">Thông tin khách hàng</h2>
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="font-semibold">Tên: </span>
                    {customerName}
                  </p>
                  <p>
                    <span className="font-semibold">Số điện thoại: </span>
                    {customerPhone}
                  </p>
                  <p>
                    <span className="font-semibold">Địa chỉ nhận hàng: </span>
                    {combinatedAddress}
                  </p>
                </div>
              </div>

              {/* Payment and Order Status */}
              <div className="mt-4">
                <div className="flex justify-start items-center gap-3">
                  <h2 className="font-semibold">Trạng thái thanh toán: </h2>
                  <span
                    className={`py-[1px] rounded-md ${
                      shopOrder.paymentStatus === "paid"
                        ? "text-green-500"
                        : " text-red-500"
                    }`}
                  >
                    {shopOrder.paymentStatus === "paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </div>
                <p className="font-semibold mt-2">
                  Tổng giá trị đơn hàng:{" "}
                  <span className="text-base text-red-700">
                    {formatCurrency(shopOrder.totalPrice)}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="w-full lg:w-1/2">
              <h2 className="pb-2 font-semibold">Sản phẩm đã đặt</h2>
              {shopOrder?.products?.map((p, i) => (
                <div
                  key={i}
                  className="mt-4 flex flex-col gap-4 p-3 bg-base-100 shadow-md rounded-md"
                >
                  <div className="flex items-center gap-3 text-md">
                    <img
                      className="w-[100px] h-[100px]"
                      src={p?.images[0]}
                      alt={p?.name}
                    />
                    <div>
                      <h2>{p?.name}</h2>
                      <p>
                        Thương hiệu: <span>{p?.brand}</span>
                      </p>
                      <p>Số lượng: {p?.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {shopOrder?.orderStatus === "pending" && (
          <div className="flex justify-end p-4">
            <button
              onClick={() => handleCancel(shopOrder._id)}
              className="btn btn-error"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
