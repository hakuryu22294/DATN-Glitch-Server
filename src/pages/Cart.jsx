import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec,
} from "../redux/store/reducers/cartReducer";
import toast from "react-hot-toast";

import { formatCurrency } from "../utils";
import { get_seller } from "../redux/store/reducers/sellerReducer";
import { FaCartShopping, FaShop } from "react-icons/fa6";

const Cart = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    card_products,
    successMessage,
    price,
    buy_product_item,
    shipping_fee,
    outofstock_products,
    errorMessage,
  } = useSelector((state) => state.cart);
  const { seller } = useSelector((state) => state.seller);

  const navigate = useNavigate();
  const redirect = () => {
    navigate("/shipping", {
      state: {
        products: card_products,
        price: price,
        shipping_fee: shipping_fee,
        items: buy_product_item,
      },
    });
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
  useEffect(() => {
    if (card_products[0]) {
      dispatch(get_seller(card_products[0].sellerId));
    }
  }, [dispatch, card_products]);
  const inc = (quantity, stock, card_id) => {
    const temp = quantity + 1;
    if (temp <= stock) {
      dispatch(quantity_inc(card_id));
    } else {
      toast.error("Out of stock");
    }
  };

  const dec = (quantity, card_id) => {
    const temp = quantity - 1;
    if (temp !== 0) {
      dispatch(quantity_dec(card_id));
    }
  };

  return (
    <div>
      <section className="bg-base-100">
        <div className="w-full lg:w-[85%] md:w-[90%] sm:w-[95%] mx-auto py-8">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
            <FaCartShopping />
            <span>Giỏ hàng</span>
          </h2>
          {card_products.length > 0 || outofstock_products.length > 0 ? (
            <div className="flex flex-wrap">
              {/* Vùng Sản phẩm đã chọn */}
              <div className="w-full mb-5 md:mb-0 lg:w-[62%] lg:mr-[5%] ">
                <div className="pr-3 md:pr-0">
                  <div className="flex flex-col gap-3">
                    <div className="bg-base-300 p-4 rounded-lg shadow-md">
                      <h2 className="text-md text-green-500 font-semibold">
                        Sản phẩm đã chọn: {buy_product_item}
                      </h2>
                    </div>

                    {card_products.map((p, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 bg-base-300 p-4 rounded-lg shadow-md"
                      >
                        {/* Shop Name */}
                        <div className="flex justify-start items-center">
                          <h2 className="text-md font-bold flex gap-2 items-center">
                            <FaShop />{" "}
                            {p.shopName || seller?.shopName || "Shop"}
                          </h2>
                        </div>

                        {/* Product Info */}
                        {p.products.map((pt, i) => (
                          <div
                            key={i}
                            className="w-full md:flex justify-between md:gap-2 sm:gap-4"
                          >
                            {/* Product Image and Info */}
                            <div className="flex gap-2 md:w-7/12 sm:w-full sm:text-sm mb-3">
                              <img
                                className="w-[80px] h-[80px] rounded-md"
                                src={pt.productInfo.images[0]}
                                alt=""
                              />
                              <div className="pr-4 text-base-content">
                                <h2 className="md:text-md sm:text-sm  font-semibold">
                                  {pt.productInfo.name}
                                </h2>
                                <span className="text-sm">
                                  Brand: {pt.productInfo.brand}
                                </span>
                                <div className="sm:pl-0 md:pl-4 flex">
                                  <h2 className="sm:text-sm md:text-md text-orange-500">
                                    {(
                                      pt?.productInfo?.price -
                                      Math.floor(
                                        (pt.productInfo.price *
                                          pt.productInfo.discount) /
                                          100
                                      )
                                    ).toLocaleString()}{" "}
                                    VND
                                    <p className="line-through text-base-content">
                                      <span>
                                        {pt.productInfo.price?.toLocaleString()}{" "}
                                        VND
                                      </span>
                                      <span>-{pt.productInfo.discount}%</span>
                                    </p>
                                  </h2>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 md:flex-col justify-end md:justify-normal">
                              <div className="flex bg-white h-[30px] justify-center items-center text-xl rounded-md">
                                <div
                                  onClick={() => dec(pt.quantity, pt._id)}
                                  className="px-3 cursor-pointer"
                                >
                                  -
                                </div>
                                <div className="px-3">{pt.quantity}</div>
                                <div
                                  onClick={() =>
                                    inc(
                                      pt.quantity,
                                      pt.productInfo.stock,
                                      pt._id
                                    )
                                  }
                                  className="px-3 cursor-pointer"
                                >
                                  +
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  dispatch(delete_card_product(pt._id))
                                }
                                className="px-5 py-[3px] rounded-md bg-red-500 text-white"
                              >
                                Xóa
                              </button>
                            </div>

                            {/* Quantity Control */}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phần Thanh toán */}
              <div className="w-full mx-auto lg:w-[33%]">
                {card_products.length > 0 && (
                  <div className="bg-base-300  rounded-lg p-4 text-base-content flex flex-col gap-3">
                    <h2 className="text-xl font-bold">Order Summary</h2>
                    <div className="flex justify-between items-center">
                      <span>{buy_product_item} mặt hàng </span>
                      <span>{formatCurrency(price)} </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Phí vận chuyển </span>
                      <span>{formatCurrency(shipping_fee)} </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total</span>
                      <span className="text-lg text-[#059473]">
                        {formatCurrency(price + shipping_fee)}{" "}
                      </span>
                    </div>
                    <button
                      onClick={redirect}
                      className="px-5 py-[6px] rounded-sm bg-red-500 text-white text-sm uppercase hover:shadow-lg"
                    >
                      Thanh toán ({buy_product_item})
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <Link
                className="px-4 py-1 bg-indigo-500 text-white"
                to="/shopping"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
