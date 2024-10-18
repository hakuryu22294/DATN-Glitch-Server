import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { order_confirm } from "../redux/store/reducers/orderReducer";
const ReturnPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const query = new URLSearchParams(location.search);
  console.log(orderId);
  console.log(location.search);
  const statusCode = query.get("vnp_ResponseCode");
  useEffect(() => {
    if (statusCode === "00") {
      dispatch(order_confirm({ orderId, paymentMethod: "vnPay" }));
    }
  }, [statusCode, orderId, dispatch]);
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Thanh Toán Thành Công!
        </h1>
        <p className="text-gray-600 mb-6">
          Giao dịch của bạn đã được thực hiện thành công. Cảm ơn bạn đã mua sắm
          cùng chúng tôi.
        </p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          onClick={handleGoHome}
        >
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default ReturnPayment;
