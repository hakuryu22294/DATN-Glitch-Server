/* eslint-disable react/prop-types */

import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../Rating";
import { Link } from "react-router-dom";
import { formatCurrency, truncate } from "../../utils/index";

const ShopProducts = ({ styles = "grid", products }) => {
  return (
    <div
      className={`w-full grid mt-5 ${
        styles === "grid" ? "lg:grid-cols-4 md:grid-cols-3" : "grid-cols-1"
      } gap-5 `}
    >
      {products &&
        products?.map((p, i) => (
          <div
            key={i}
            className={`flex transition-all shadow-lg p-5 duration-1000 hover:shadow-md hover:-translate-y-3 ${
              styles === "grid"
                ? "flex-col justify-start items-center"
                : "flex-col justify-start items-start"
            } w-full gap p-1 rounded-md bg-base-300`}
          >
            <div
              className={`w-full relative group h-[170px] sm:h-[200px] md:h-[270px] overflow-hidden ${
                styles === "grid" ? "mb-5" : "mr-5"
              }`}
            >
              <img
                loading="lazy"
                className="h-[170px] sm:h-[240px] md:h-[270px] rounded-md  object-cover"
                src={p.images[0]}
                alt=""
              />
              <ul className="flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
                <li className="w-[38px] h-[38px] cursor-pointer bg-secondary text-base-content flex justify-center items-center rounded-full  hover:rotate-[720deg] transition-all">
                  <FaRegHeart />
                </li>
                <Link
                  to={`/product/details/${p.slug}`}
                  className="w-[38px] h-[38px] cursor-pointer bg-secondary text-base-content flex justify-center items-center rounded-full  hover:rotate-[720deg] transition-all"
                >
                  <FaEye />
                </Link>
                <li className="w-[38px] h-[38px] cursor-pointer bg-secondary text-base-content flex justify-center items-center rounded-full  hover:rotate-[720deg] transition-all">
                  <RiShoppingCartLine />
                </li>
              </ul>
            </div>

            <div className="flex justify-start items-start flex-col gap-1">
              <h2 className="font-bold">{truncate(p.name, 40)}</h2>
              <div className="flex justify-start items-center gap-3">
                <span className="text-md font-semibold">
                  {formatCurrency(p.price)}
                </span>
                <div className="flex">
                  <Rating ratings={p.rating} />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ShopProducts;
