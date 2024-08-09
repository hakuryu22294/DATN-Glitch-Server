import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  get_seller_order,
  messageClear,
  seller_order_status_update,
} from "../../../redux/store/reducers/orderReducer";
import toast from "react-hot-toast";
import moment from "moment";
import { formatCurrency } from "../../../utils";

const orderStatus = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  returned: "Returned",
};
const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [orderId, dispatch]);
  const { shopOrder, errorMessage, successMessage } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    setStatus(shopOrder?.orderStatus);
  }, [shopOrder]);
  const status_update = (e) => {
    dispatch(
      seller_order_status_update({ orderId, info: { status: e.target.value } })
    );
    setStatus(e.target.value);
  };

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
  let combinatedAddress = `${shopOrder?.shippingInfo?.name}, ${shopOrder?.shippingInfo?.address}, ${shopOrder?.shippingInfo?.phone}, ${shopOrder?.shippingInfo?.ward.full_name}, ${shopOrder?.shippingInfo?.district.full_name}, ${shopOrder?.shippingInfo?.province.full_name}`;
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl">Order Details</h2>
          <select
            onChange={status_update}
            value={status}
            name=""
            id=""
            className="px-4 py-2 focus:border-rose-500 outline-none bg-white border border-slate-700 rounded-md "
          >
            {Object.entries(orderStatus).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4">
          <div className="flex gap-2 text-lg ">
            <h2>#{shopOrder._id}</h2>
            <span>{moment(shopOrder.orderDate).format("DD/MM/YYYY")}</span>
          </div>

          <div className="flex flex-wrap">
            <div className="w-[30%]">
              <div className="pr-3  text-lg">
                <div className="flex flex-col gap-1">
                  <h2 className="pb-2 font-semibold">
                    Deliver To : {combinatedAddress}
                  </h2>
                </div>
                <div className="flex justify-start items-center gap-3">
                  <h2 className="font-semibold">Payment Status: </h2>
                  <span className="text-base bg-rose-400 p-1 rounded-md font-semibold">
                    {shopOrder.paymentStatus}
                  </span>
                </div>
                <p className="font-semibold">
                  Price :{" "}
                  <span className="text-base text-red-700">
                    {formatCurrency(shopOrder.totalPrice)}
                  </span>
                </p>

                {shopOrder?.products?.map((p, i) => (
                  <div
                    key={i}
                    className="mt-4 flex flex-col gap-4 p-3 bg-rose-50 shadow-md rounded-md"
                  >
                    <div className="">
                      <div className="flex items-center gap-3 text-md">
                        <img
                          className="w-[100px] h-[100px]"
                          src={p?.images[0]}
                          alt=""
                        />

                        <div>
                          <h2>{p?.name}</h2>
                          <p>
                            Brand : <span>{p?.brand}</span>
                          </p>

                          <p className="text-lg">Quantity : {p?.quantity} </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
