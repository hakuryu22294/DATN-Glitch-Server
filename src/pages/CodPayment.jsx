import { useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { order_confirm } from "../redux/store/reducers/orderReducer";

const CODPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  useEffect(() => {
    dispatch(order_confirm({ orderId, paymentMethod: "cod" }));
  }, [dispatch, orderId]);
  const handleViewOrderDetails = () => {
    navigate("/dashboard/order/details/" + orderId);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="w-full max-w-md mx-auto py-16 px-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title text-2xl font-bold">Đặt hàng thành công</h2>
          <p className="text-lg mb-4">
            Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn sẽ được xử lý và giao tận
            tay bạn.
          </p>
          <div className="card-actions justify-center gap-4">
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={handleViewOrderDetails}
            >
              <FaInfoCircle />
              Xem chi tiết đơn hàng
            </button>
            <button
              className="btn btn-secondary flex items-center gap-2"
              onClick={handleContinueShopping}
            >
              <FaShoppingCart />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CODPayment;
