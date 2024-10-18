import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  get_info_order,
  update_delivery_status,
  messageClear,
} from "../../../redux/store/reducers/shipperReducer";
import toast from "react-hot-toast";

const innerDeliveryStatus = [
  {
    status: "assigned",
    color: "bg-yellow-500",
    text: "Đang giao hàng",
  },
  {
    status: "delivered",
    color: "bg-green-500",
    text: "Đã giao hàng",
  },
  {
    status: "cancelled",
    color: "bg-red-500",
    text: "Đã huỷ",
  },
];
const innerPaymentStatus = [
  {
    status: "unpaid",
    color: "bg-yellow-500",
    text: "Chưa thanh toán",
  },
  {
    status: "paid",
    color: "bg-green-500",
    text: "Đã thanh toán",
  },
];

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(get_info_order({ orderId }));
  }, [orderId, dispatch]);

  const { orderInfo, loading, successMessage, errorMessage } = useSelector(
    (state) => state.shipper
  );

  const handleUpdateStatus = (newStatus) => {
    dispatch(update_delivery_status({ orderId, status: newStatus }));
  };

  const deliveryStatus = innerDeliveryStatus.find(
    (status) => status.status === orderInfo?.deliveryStatus
  );
  const paymentStatus = innerPaymentStatus.find(
    (status) => status.status === orderInfo?.paymentStatus
  );

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/shipper/dashboard/orders");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, navigate, dispatch]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-base-100 rounded-xl shadow-md space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
        <p>
          Mã đơn hàng:{" "}
          <span className="font-semibold">{orderInfo?._id?.toUpperCase()}</span>
        </p>
        <p>
          Ngày đặt hàng:{" "}
          <span className="font-semibold">
            {new Date(orderInfo?.orderDate).toLocaleDateString()}
          </span>
        </p>
        <p>
          Trạng thái:{" "}
          <span className={`badge ${deliveryStatus?.color} text-base-100`}>
            {deliveryStatus?.text}
          </span>
        </p>
        <p>
          Tổng giá trị:{" "}
          <span className="text-lg font-bold text-green-600">
            {orderInfo?.totalPrice?.toLocaleString()} VND
          </span>
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Thông tin người nhận</h3>
        <p>Tên: {orderInfo?.shippingInfo?.name}</p>
        <p>Điện thoại: {orderInfo?.shippingInfo?.phone}</p>
        <p>
          Địa chỉ:{" "}
          {`${orderInfo?.shippingInfo?.address}, ${orderInfo?.shippingInfo?.ward} ,${orderInfo?.shippingInfo?.district}, ${orderInfo?.shippingInfo?.province}`}
        </p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Danh sách sản phẩm</h3>
        <div className="space-y-4">
          {orderInfo?.products?.map((item, index) => {
            const discountedPrice = item.price * (1 - item.discount / 100);

            return (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg shadow-sm bg-base-300 text-base-content"
              >
                <img
                  className="w-16 h-16 object-cover rounded-lg"
                  src={item.images[0]}
                  alt={item.name}
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{item?.name}</h4>
                  <p>Số lượng: {item?.quantity}</p>
                  <p className="text-gray-500 line-through">
                    Giá gốc: {item?.price?.toLocaleString()} VND
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Giá sau giảm: {discountedPrice.toLocaleString()} VND
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          Phương thức thanh toán & giao hàng
        </h3>
        <p>
          Thanh toán:{" "}
          <span className={`badge ${paymentStatus?.color} text-base-100`}>
            {paymentStatus?.text}
          </span>
        </p>
        <p>Vận chuyển: G-Express</p>
      </div>
      {orderInfo?.deliveryStatus === "assigned" && (
        <div className="flex justify-end">
          <button
            className="btn btn-success"
            onClick={() => handleUpdateStatus("delivered")}
            disabled={orderInfo?.deliveryStatus === "delivered" || loading}
          >
            Hoàn thành
          </button>
          <button
            className="btn btn-error ml-2"
            onClick={() => handleUpdateStatus("cancelled")}
            disabled={orderInfo?.deliveryStatus === "cancelled" || loading}
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
