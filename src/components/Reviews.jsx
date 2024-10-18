/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Rating from "./Rating";
import RatingTemp from "./RatingTemp";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import RatingReact from "react-rating";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  customer_review,
  get_reviews,
  messageClear,
  product_details,
} from "../redux/store/reducers/homeReducer";
import toast from "react-hot-toast";

const Reviews = ({ product }) => {
  const dispatch = useDispatch();
  const [parPage, setParPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const { userInfo } = useSelector((state) => state.auth);
  const { successMessage, reviews, rating_review, totalReview } = useSelector(
    (state) => state.home
  );

  const [rat, setRat] = useState("");
  const [re, setRe] = useState("");

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(
        get_reviews({
          productId: product._id,
          pageNumber,
        })
      );
      dispatch(product_details(product.slug));
      setRat("");
      setRe("");
      dispatch(messageClear());
    }
  }, [successMessage, dispatch, product._id, product.slug, pageNumber]);

  useEffect(() => {
    if (product._id) {
      dispatch(
        get_reviews({
          productId: product._id,
          pageNumber,
        })
      );
    }
  }, [pageNumber, product, dispatch]);

  const renderRatingBar = (rating, sum) => {
    const width = Math.floor((100 * sum) / totalReview);
    return (
      <div className="flex justify-start items-center gap-5">
        <div className="text-md flex gap-1 w-[93px]">
          <RatingTemp rating={rating} />
        </div>
        <div className="w-[200px] h-[14px] bg-slate-200 relative">
          <div
            style={{ width: `${width}%` }}
            className={`h-full bg-[#Edbb0E]`}
            aria-label={`Rating ${rating} stars`}
          ></div>
        </div>
        <p className="text-sm text-slate-600">{sum}</p>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex gap-10">
        <div className="flex flex-col gap-2 justify-start items-start py-4">
          <div>
            <span className="text-6xl font-semibold">{product?.rating}</span>
            <span className="text-3xl font-semibold text-base-content">/5</span>
          </div>
          <div className="flex text-3xl">
            <Rating ratings={product?.rating} />
          </div>
          <p className="text-sm text-base-content">({totalReview}) Reviews</p>
        </div>

        <div className="hidden md:flex gap-2 flex-col py-4">
          {Array.from({ length: 5 }, (_, index) =>
            renderRatingBar(5 - index, rating_review[4 - index]?.sum || 0)
          )}
          {renderRatingBar(0, 0)}
        </div>
      </div>

      <h2 className="text-base-content text-xl font-bold py-5">
        Product Review ({totalReview})
      </h2>

      <div className="flex flex-col gap-8 pb-10 pt-4">
        {reviews.map((r, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <div className="flex gap-1 text-xl">
                <RatingTemp rating={r?.rating} />
              </div>
              <span className="text-base-content">{r?.date}</span>
            </div>
            <span className="text-base-content text-md">
              {r.customerId?.name}
            </span>
            <p className="text-base-content text-sm">{r?.review}</p>
          </div>
        ))}
        <div className="flex justify-end">
          {totalReview > 5 && (
            <Pagination
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalItem={totalReview}
              parPage={parPage}
              showItem={Math.floor(totalReview / 3)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
