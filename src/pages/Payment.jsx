import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { createPaymentUrl } from "../redux/store/reducers/paymentReducer";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../utils";

const Payment = () => {
  const dispatch = useDispatch();
  const {
    state: { price, items, orderId },
  } = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("vnPay");
  const { paymentUrl, loading, error } = useSelector((state) => state.payment);

  const handlePayment = () => {
    if (paymentMethod === "vnPay" && paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  useEffect(() => {
    dispatch(
      createPaymentUrl({
        amount: price,
        orderId,
        returnUrl: `http://localhost:5173/return_VNP/${orderId}?`,
      })
    );
  }, [dispatch, price, items, orderId]);

  return (
    <div>
      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap md:flex-row-reverse gap-6">
            {/* Payment Method Selection */}
            <div className="w-full md:w-7/12">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold text-center">
                    Pay with VNPay
                  </h2>
                  <p className="text-center text-gray-600">
                    Complete your payment securely with VNPay
                  </p>
                  <div className="mt-6">
                    <button
                      className="btn btn-primary w-full"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Pay Now with VNPay"}
                    </button>
                    {error && (
                      <p className="text-red-500 mt-2 text-center">
                        {error.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full md:w-5/12">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title font-bold text-xl">
                    Order Summary
                  </h2>
                  <div className="flex justify-between mt-2">
                    <span>{items} Items and Shipping Fee Included</span>
                    <span>{formatCurrency(price)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-4">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      {formatCurrency(price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Payment;
