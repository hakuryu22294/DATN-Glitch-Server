/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../Rating";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  add_to_card,
  add_to_wishlist,
  get_card_products,
  messageClear,
} from "../../redux/store/reducers/cartReducer";
import toast from "react-hot-toast";
import { formatCurrency, truncate } from "../../utils";
import { FaLocationDot } from "react-icons/fa6";

const FeatureProducts = ({ products, title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage } = useSelector((state) => state.cart);

  const add_card = (id) => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity: 1,
          productId: id,
        })
      );
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(get_card_products(userInfo.id));
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, userInfo.id]);

  console.log(products);
  const add_wishlist = (pro) => {
    dispatch(
      add_to_wishlist({
        userId: userInfo.id,
        productId: pro._id,
        name: pro.name,
        price: pro.price,
        image: pro.images[0],
        discount: pro.discount,
        rating: pro.rating,
        slug: pro.slug,
      })
    );
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="w-full">
        <div className=" flex  flex-col text-4xl font-bold relative pb-[45px]">
          <h2 className="text-base-content mt-10">{title}</h2>
          <div className="w-[100%] h-[2px] bg-primary mt-4 "></div>
        </div>
      </div>

      <div className="w-full grid gap-5 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products?.map((p, i) => (
          <Link
            to={`/product/details/${p.slug}`}
            key={i}
            className="rounded-md p-4 bg-base-300 shadow-lg group transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative overflow-hidden">
              {p.discount ? (
                <div className="badge badge-accent absolute left-2 top-2">
                  {p.discount}% Off
                </div>
              ) : null}

              {p.stock === 0 && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-[150px] h-[150px] bg-neutral opacity-50 rounded-full "></div>
                  <span className="absolute text-white font-bold text-lg">
                    Hết hàng
                  </span>
                </div>
              )}
              <img
                loading="lazy"
                className="w-full h-[200px] object-cover rounded-md"
                src={p.images[0]}
                alt={p.name}
              />
            </div>

            <div className="py-3 text-center  text-base-content">
              <h3 className="font-bold text-lg">{truncate(p.name, 40)}</h3>
              <div className="flex justify-center items-center  mt-2">
                <span className="text-lg text-red-500 font-semibold mr-2">
                  {formatCurrency(p.price - (p.price * p.discount) / 100)}
                </span>
                <Rating ratings={p.rating} />
              </div>
              <div className="mt-2 text-sm text-gray-600 flex justify-between  items-center">
                <p className="font-bold text-accent pr-2 border-r">
                  Đã bán: {p.sold}
                </p>
                <p className="flex items-center gap-1 text-base-content">
                  <FaLocationDot />
                  {p?.sellerId?.shopInfo?.address}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeatureProducts;
