import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import toast from "react-hot-toast";
import Rating from "react-rating";

const ReviewModal = ({ product, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || review.trim() === "") {
      toast.error("Please provide both rating and review text.");
      return;
    }
    onSubmit(product?._id, rating, review);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-xl font-bold mb-4">
          Write a Review for {product?.name}
        </h3>
        <div className="flex items-center mb-4">
          <Rating
            onChange={(rating) => setRating(rating)}
            initialRating={rating}
            emptySymbol={<CiStar className="text-slate-600 text-4xl" />}
            fullSymbol={<FaStar className="text-[#Edbb0E] text-4xl" />}
          />
        </div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
