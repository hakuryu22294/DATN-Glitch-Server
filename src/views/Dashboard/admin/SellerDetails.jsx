import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  get_seller,
  seller_status_update,
  messageClear,
} from "../../../redux/store/reducers/sellerReducer";
import avtDefault from "../../../assets/user.png";
import toast from "react-hot-toast";
import {
  FaStar,
  FaBoxOpen,
  FaShoppingCart,
  FaClipboardList,
} from "react-icons/fa";
const reviews = [
  {
    id: 1,
    reviewer: "Alice",
    rating: 4,
    comment: "Great product! Highly recommend.",
    date: "2024-09-10",
  },
  {
    id: 2,
    reviewer: "Bob",
    rating: 5,
    comment: "Excellent quality and service.",
    date: "2024-09-11",
  },
  {
    id: 3,
    reviewer: "Charlie",
    rating: 3,
    comment: "Good, but there is room for improvement.",
    date: "2024-09-12",
  },
];
const SellerDetails = () => {
  const dispatch = useDispatch();
  const { seller, successMessage } = useSelector((state) => state.seller);
  const { sellerId } = useParams();

  useEffect(() => {
    dispatch(get_seller(sellerId));
  }, [sellerId, dispatch]);

  const [status, setStatus] = useState("");
  const submit = (e) => {
    e.preventDefault();
    dispatch(
      seller_status_update({
        sellerId,
        status,
      })
    );
  };
  console.log(seller);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (seller) {
      setStatus(seller.status);
    }
  }, [seller]);

  return (
    <div className="px-4 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">Seller Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info & Avatar */}
        <div className="col-span-1 bg-base-100 p-6 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <img
              className="w-32 h-32 mx-auto rounded-full border-4 border-gray-200"
              src={seller?.sellerInfo?.avatar || avtDefault}
              alt="Seller Avatar"
            />
            <h2 className="text-2xl font-semibold mt-4">
              {seller?.sellerInfo?.shopInfo?.shopName || "Shop Name"}
            </h2>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Basic Info</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Status:</strong> {seller?.sellerInfo?.status || "N/A"}
              </li>
              <li>
                <strong>Shop Name:</strong>{" "}
                {seller?.sellerInfo?.shopInfo?.phoneNumber || "N/A"}
              </li>
              <li>
                <strong>Shop Address:</strong>{" "}
                {seller?.sellerInfo?.shopInfo?.address || "N/A"}
              </li>
            </ul>
          </div>
        </div>

        {/* Shop Statistics */}
        <div className="col-span-1 lg:col-span-2 bg-base-100 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md flex flex-col items-center">
              <FaClipboardList className="text-blue-600 text-3xl mb-2" />
              <h4 className="text-lg font-semibold">Total Items</h4>
              <p className="text-xl font-bold">{seller?.totalItems || 0}</p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col items-center">
              <FaShoppingCart className="text-green-600 text-3xl mb-2" />
              <h4 className="text-lg font-semibold">Items Sold</h4>
              <p className="text-xl font-bold">{seller?.itemsSold || 0}</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex flex-col items-center">
              <FaStar className="text-yellow-600 text-3xl mb-2" />
              <h4 className="text-lg font-semibold">Rating</h4>
              <p className="text-xl font-bold">{seller?.rating || 0} / 5</p>
            </div>

            <div className="bg-pink-100 p-4 rounded-lg shadow-md flex flex-col items-center">
              <FaBoxOpen className="text-pink-600 text-3xl mb-2" />
              <h4 className="text-lg font-semibold">Pending Orders</h4>
              <p className="text-xl font-bold">{seller?.pendingOrders || 0}</p>
            </div>
          </div>
          <div className="mt-8 bg-base-200 text-base-content p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
            {reviews.length > 0 ? (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li key={review.id} className="border-b pb-3">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">
                        {review.reviewer}:
                      </span>
                      <span className="text-yellow-500">
                        {"★".repeat(review.rating)}{" "}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{review.comment}</p>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Address and Shop Info */}

      {/* Status Update */}
      <div className="mt-8">
        <form onSubmit={submit} className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered w-full max-w-xs"
            required
          >
            <option value="">-- Select Status --</option>
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </select>
          <button className="btn btn-primary">Update Status</button>
        </form>
      </div>
    </div>
  );
};

export default SellerDetails;
