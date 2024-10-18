import { useEffect } from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  get_wishlist_products,
  remove_wishlist,
  messageClear,
} from "../redux/store/reducers/cartReducer";
import toast from "react-hot-toast";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlist, successMessage } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(get_wishlist_products(userInfo.id));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);
  console.log(wishlist);
  return (
    <div className=" mx-auto">
      <div className="text-3xl font-semibold mb-5">Wishlist</div>
      <div className=" p-5 rounded-lg bg-base-300 shadow-md mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {wishlist?.map((p, i) => (
          <div
            key={i}
            className="border rounded-lg group transition-all duration-500 hover:shadow-md hover:-mt-3 p-4"
          >
            <div className="relative overflow-hidden object-cover">
              {p.discount !== 0 && (
                <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                  {p.discount}%{" "}
                </div>
              )}

              <img
                loading="lazy"
                className="object-cover w-[240px] h-[240px] rounded-lg"
                src={p.image}
                alt=""
              />

              <ul className="flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
                <Link
                  to={`/product/details/${p.productId.slug}`}
                  className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#059473] hover:text-white hover:rotate-[720deg] transition-all"
                >
                  <FaEye />
                </Link>
              </ul>
            </div>

            <div className="py-3 text-base-content px-2">
              <h2 className="font-bold">{p.name} </h2>
              <div className="flex justify-start items-center gap-3">
                <span className="text-md font-semibold">
                  {p.price.toLocaleString()}
                </span>
                <div className="flex">
                  <Rating ratings={p.rating} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
