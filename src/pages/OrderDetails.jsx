import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  cancel_order,
  get_order_details,
  messageClear,
  received_order,
} from "../redux/store/reducers/orderReducer";
import { messageClear as messageClearHome } from "../redux/store/reducers/homeReducer";
import { formatCurrency } from "../utils";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import toast from "react-hot-toast";
import { customer_review } from "../redux/store/reducers/homeReducer";
import ReviewModal from "../components/ui/ReviewModal"; // Import ReviewModal

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

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { order, successMessage, errorMessage } = useSelector(
    (state) => state.order
  );
  const { successMessage: successMessageHome, errorMessage: errorMessageHome } =
    useSelector((state) => state.home);

  const [reviewModal, setReviewModal] = useState(null);

  const handleReview = (productId) => {
    setReviewModal(productId);
  };

  const handleCloseModal = () => {
    setReviewModal(null);
  };

  const handleSubmitReview = (productId, rating, review) => {
    dispatch(
      customer_review({
        review,
        rating,
        productId: productId,
        orderId: order._id,
        customerId: userInfo.id,
      })
    );
  };
  useEffect(() => {
    if (successMessageHome) {
      toast.success(successMessageHome);
      dispatch(messageClearHome());
    }
    if (errorMessageHome) {
      toast.error(errorMessageHome);
      dispatch(messageClearHome());
    }
  }, [dispatch, successMessageHome, errorMessageHome]);
  const handleCancel = (orderId) => {
    dispatch(cancel_order({ orderId }));
    dispatch(get_order_details(orderId));
    navigate("/seller/dashboard/orders");
  };

  const handleReceived = (orderId) => {
    dispatch(received_order({ orderId }));
    dispatch(get_order_details(orderId));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/dashboard/my-orders");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  useEffect(() => {
    dispatch(get_order_details(orderId));
  }, [orderId, dispatch]);

  return (
    <div className="p-6 bg-base-300 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-primary mb-4">
        Order ID: #{order?._id}
        <span className="text-sm text-gray-500 pl-2">{order?.date}</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Shipping Info */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-base-content">Deliver To</h2>
            <p className="badge badge-info">{order?.shippingInfo?.name}</p>
            <p className="flex gap-2 items-center text-sm text-base-content">
              <FaLocationDot /> {order?.shippingInfo?.address} ,{" "}
              {order?.shippingInfo?.province}
            </p>
            <p className="flex gap-2 items-center text-sm text-base-content">
              <FaEnvelope /> {userInfo.email}
            </p>
            <p className="flex gap-2 items-center text-sm text-base-content">
              <FaPhoneAlt /> {order?.shippingInfo?.phone}
            </p>
          </div>
        </div>

        {/* Order Info */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-base-content">Order Summary</h2>
            <p className="text-md font-bold text-error">
              Price: {formatCurrency(order?.totalPrice)} (Including Shipping)
            </p>
            <p className="text-md">
              Payment Status:{" "}
              <span
                className={`text-sm font-bold ${
                  paymentStatus[order?.paymentStatus]?.color
                }`}
              >
                {paymentStatus[order?.paymentStatus]?.text}
              </span>
            </p>
            <p className="text-md">
              Delivery Status:{" "}
              <span
                className={`text-sm font-bold ${
                  deliveryStatus[order?.deliveryStatus]?.color
                }`}
              >
                {deliveryStatus[order?.deliveryStatus]?.text}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Order Products */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-base-content mb-4">Order Products</h2>
          <div className="flex flex-col gap-4">
            {order?.products?.map((p, i) => (
              <Fragment key={i}>
                <div key={i} className="flex items-center gap-4 border-b pb-4">
                  {/* Product Image */}
                  <div className="avatar">
                    <div className="w-16 rounded">
                      <img src={p.images[0]} alt={p.name} />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col text-sm">
                    <Link
                      to={`/product/${p._id}`}
                      className="font-semibold text-primary"
                    >
                      {p.name}
                    </Link>
                    <p className="text-base-content">Brand: {p.brand}</p>
                    <p className="text-base-content">Quantity: {p.quantity}</p>
                  </div>

                  {/* Product Price */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-lg font-bold text-success">
                      {formatCurrency(
                        p.price - Math.floor((p.price * p.discount) / 100)
                      )}
                    </span>
                    <span className="line-through text-sm text-gray-500">
                      {formatCurrency(p.price)}
                    </span>
                    <span className="badge badge-info">-{p.discount}%</span>
                  </div>
                </div>

                {order.orderStatus === "completed" && (
                  <button
                    onClick={() => handleReview(p._id)}
                    className="btn btn-primary w-1/6 mt-2"
                  >
                    Đánh giá
                  </button>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 text-end">
        {order?.orderStatus?.includes("pending") && (
          <button
            onClick={() => handleCancel(order?._id)}
            className="btn btn-error"
          >
            Hủy
          </button>
        )}
        {order?.deliveryStatus?.includes("delivered") &&
          order?.orderStatus === "waiting_receive" && (
            <button
              onClick={() => handleReceived(order?._id)}
              className="btn btn-primary"
            >
              Đã nhận được hàng
            </button>
          )}
      </div>

      {reviewModal && (
        <ReviewModal
          product={order.products.find((p) => p._id === reviewModal)}
          onClose={handleCloseModal}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default OrderDetails;
