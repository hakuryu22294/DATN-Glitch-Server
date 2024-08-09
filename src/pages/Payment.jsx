import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import vnpayImg from "../assets/vnpay.png";
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
  console.log(price, items, orderId);
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
      <section className="bg-[#eeeeee]">
        <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4 ">
          <div className="flex flex-wrap md:flex-col-reverse">
            <div className="w-7/12 md:w-full">
              <div className="pr-2 md:pr-0">
                <div className="flex flex-wrap">
                  <div
                    onClick={() => setPaymentMethod("vnPay")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "vnPay" ? "bg-white" : "bg-slate-100"
                    } `}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img src={vnpayImg} alt="VNPay" />
                    </div>
                    <span className="text-slate-600">VNPay</span>
                  </div>
                </div>
                {paymentMethod === "vnPay" && (
                  <div className="w-full px-4 py-8 bg-white shadow-sm">
                    <button
                      className="px-10 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-[#059473] text-white"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                    {error && <p className="text-red-500">{error.message}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="w-5/12 md:w-full">
              <div className="pl-2 md:pl-0 md:mb-0">
                <div className="bg-white shadow p-5 text-slate-600 flex flex-col gap-3">
                  <h2 className="font-bold text-lg">Order Summary </h2>
                  <div className="flex justify-between items-center">
                    <span>{items} Items and Shipping Fee Included </span>
                    <span>${formatCurrency(price)} </span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount </span>
                    <span className="text-lg text-green-600">
                      ${formatCurrency(price)}
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
