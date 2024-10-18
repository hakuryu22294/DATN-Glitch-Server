import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Rating from "../components/Rating";
import { FaHeart, FaCartPlus, FaLocationDot } from "react-icons/fa6";
import Reviews from "../components/Reviews";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { formatCurrency } from "../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import { product_details } from "../redux/store/reducers/homeReducer";
import toast from "react-hot-toast";
import {
  add_to_card,
  messageClear,
  add_to_wishlist,
  get_card_products,
} from "../redux/store/reducers/cartReducer";
import { get_seller } from "../redux/store/reducers/sellerReducer";
import sellerAvtDf from "../assets/seller.png";
import { FaStar } from "react-icons/fa";
import LoadingSpinners from "./LoadingSpinners";

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, relatedProducts, reviews, loader } = useSelector(
    (state) => state.home
  );
  const { seller } = useSelector((state) => state.seller);

  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage } = useSelector((state) => state.cart);
  const [image, setImage] = useState("");
  const [state, setState] = useState("reviews");
  useEffect(() => {
    dispatch(get_seller(product.sellerId));
  }, [dispatch, product.sellerId]);
  useEffect(() => {
    dispatch(product_details(slug));
    window.scrollTo(0, 0);
  }, [dispatch, slug]);

  useEffect(() => {
    if (product) {
      setImage(product.images ? product.images[0] : "");
      dispatch(get_seller(product.sellerId));
    }
  }, [dispatch, product]);
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

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1920 },
      items: 4,
    },
    laptop: {
      breakpoint: { max: 1920, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
    smmobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
    },
    xsmobile: {
      breakpoint: { max: 440, min: 0 },
      items: 0,
    },
  };

  const [quantity, setQuantity] = useState(1);

  const inc = () => {
    if (quantity >= product.stock) {
      toast.error("Out of Stock");
    } else {
      setQuantity(quantity + 1);
    }
  };

  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const add_card = () => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          productId: product._id,
        })
      );
    } else {
      navigate("/login");
    }
  };

  const add_wishlist = () => {
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          discount: product.discount,
          rating: product.rating || 0,
          slug: product.slug,
        })
      );
    } else {
      navigate("/login");
    }
  };

  const buynow = () => {
    let price = 0;
    if (product.status === "unpublished" || product.stock === 0) {
      toast.error("Sản phẩm không còn tồn tại hoặc đã hết hàng");
      return;
    }
    if (product.discount !== 0) {
      price =
        product.price - Math.floor((product.price * product.discount) / 100);
    } else {
      price = product.price;
    }

    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        price: quantity * price,
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ];

    navigate("/shipping", {
      state: {
        products: obj,
        price: price * quantity,
        shipping_fee: 20000,
        items: 1,
      },
    });
  };

  if (loader) {
    return <LoadingSpinners />;
  }

  return (
    <div>
      <section>
        <div className="bg-base-200 py-5 mb-5">
          <div className="w-full  md:w-[80%] lg:w-[80%] h-full mx-auto">
            <div className="flex justify-start items-center text-md text-base-content w-full">
              <Link to="/">Home</Link>
              <span className="pt-1">
                <IoIosArrowForward />
              </span>
              <Link to="/">{product.category}</Link>
              <span className="pt-1">
                <IoIosArrowForward />
              </span>
              <span>{product.name} </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-[95%] lg:w-[80%] lg:p-10 rounded-lg bg-base-300 lg:h-full shadow-lg h-auto mx-auto mb-16">
          <div className="grid p-5 grid-cols-1 lg:grid-cols-2 lg:p-0  gap-8">
            <div>
              <img
                className="w-full lg:h-[500px] rounded-lg mx-auto"
                src={image ? image : product?.images?.[0]}
                alt=""
              />

              <div className="py-3 mx-auto">
                {product.images && (
                  <Carousel
                    autoPlay={true}
                    infinite={true}
                    responsive={responsive}
                    transitionDuration={500}
                  >
                    {product?.images.map((img, i) => {
                      return (
                        <div
                          key={i}
                          className="cursor-pointer w-full"
                          onClick={() => setImage(img)}
                        >
                          <img
                            loading="lazy"
                            className="h-[120px] w-[120px] rounded-lg cursor-pointer"
                            src={img}
                            alt=""
                          />
                        </div>
                      );
                    })}
                  </Carousel>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="text-3xl text-base-content font-bold">
                <h3>{product?.name} </h3>
              </div>
              <div className="flex justify-start items-center gap-4">
                <div className="flex text-xl">
                  <Rating ratings={product?.rating ? product.rating : 0} />
                </div>
                <span className="text-green-500">
                  ({reviews ? `${reviews.length} đánh giá` : "chưa đánh giá"})
                </span>
              </div>

              <div className="text-2xl text-rose-500 font-bold flex gap-3">
                {product.discount !== 0 ? (
                  <>
                    <h2>
                      {formatCurrency(
                        product?.price -
                          Math.floor((product.price * product.discount) / 100)
                      )}
                      (-{product.discount}%)
                    </h2>
                    <p className="line-through">
                      {formatCurrency(product?.price)}
                    </p>
                  </>
                ) : (
                  <h2> Price : {formatCurrency(product?.price)} </h2>
                )}
              </div>
              <div className="flex gap-3 pb-10 border-b ">
                {product?.stock ? (
                  <>
                    <div className="flex bg-base-100 rounded-md border-base-200 h-[50px] justify-center items-center text-xl">
                      <div
                        onClick={dec}
                        className="px-6 py-2 border-r cursor-pointer"
                      >
                        -
                      </div>
                      <div className="px-6">{quantity}</div>
                      <div
                        onClick={inc}
                        className="px-6 py-2   border-l cursor-pointer"
                      >
                        +
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={add_card}
                        className="px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg bg-rose-500 rounded-md text-white"
                      >
                        <FaCartPlus />
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div>
                  <div
                    onClick={add_wishlist}
                    className="h-[50px] w-[50px] rounded-md flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/40 bg-cyan-500 text-white"
                  >
                    <FaHeart />
                  </div>
                </div>
              </div>

              <div className="flex py-5 gap-5">
                <div className="w-[150px] font-bold text-xl flex flex-col gap-5">
                  <span>Tình trạng</span>
                </div>
                <div className="flex flex-col gap-5">
                  <span
                    className={`text-${product?.stock ? "green" : "red"}-500`}
                  >
                    {product?.stock
                      ? `Còn hàng(${product?.stock})`
                      : "Đã bán hết"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {product.stock ? (
                  <button
                    onClick={buynow}
                    className="px-8 py-3 h-[50px] cursor-pointer bg-primary text-white rounded-md"
                  >
                    Mua ngay
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-[95%] lg:w-[80%] grid grid-cols-1  lg:grid-cols-3 h-auto mx-auto">
          <div className="col-span-1">
            <div className="card w-full card-body bg-base-300 shadow-xl mb-5">
              <h2 className="text-2xl font-bold mb-3">Chi tiết người bán</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="avatar">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full">
                    <img
                      className="w-full object-cover"
                      src={
                        seller?.sellerInfo?.avatar
                          ? seller?.sellerInfo?.avatar
                          : sellerAvtDf
                      }
                    />
                  </div>
                </div>
                <div className="p-2">
                  <h2 className="text-xl font-bold">
                    {seller?.sellerInfo?.shopInfo?.shopName}
                  </h2>
                  <div className="flex gap-1 justify-center items-center">
                    <FaLocationDot />
                    <span className="pr-3 border-r">
                      {seller?.sellerInfo?.shopInfo?.address}
                    </span>
                    <span className="pl-3  flex gap-2 items-center">
                      <FaStar className="text-yellow-500" />
                      <span>{seller?.shopRating} sao</span>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div>
                      <p>{seller?.totalSold} đã bán</p>
                    </div>
                    <div>
                      <p>{seller?.totalProducts} sẩn phẩm</p>
                    </div>
                  </div>
                </div>
                <div className="p-4"></div>
              </div>
              <div className="card-actions justify-end">
                <Link
                  to={`/shop/${product.sellerId}`}
                  className="btn btn-primary"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap col-span-2">
            <div className="w-[90%] mx-auto">
              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <button
                    onClick={() => setState("reviews")}
                    className={`py-1 hover:text-white px-5 hover:bg-[#059473] ${
                      state === "reviews"
                        ? "bg-[#059473] text-white"
                        : "bg-slate-200 text-slate-700"
                    } rounded-sm`}
                  >
                    Reviews{" "}
                  </button>

                  <button
                    onClick={() => setState("description")}
                    className={`py-1 hover:text-white px-5 hover:bg-[#059473] ${
                      state === "description"
                        ? "bg-[#059473] text-white"
                        : "bg-slate-200 text-slate-700"
                    } rounded-sm`}
                  >
                    Description{" "}
                  </button>
                </div>

                <div>
                  {state === "reviews" ? (
                    <Reviews product={product} />
                  ) : (
                    <p className="py-5 text-slate-600">
                      {product?.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-[95%] md:w-[80%] lg:w-[80%] h-full mx-auto">
          <h2 className="text-2xl font-bold py-8">Related Products </h2>
          <div>
            <Swiper
              slidesPerView="auto"
              breakpoints={{
                1280: {
                  slidesPerView: 5,
                },
                1024: {
                  slidesPerView: 4,
                },
                768: {
                  slidesPerView: 3,
                },
                565: {
                  slidesPerView: 2,
                },
              }}
              spaceBetween={25}
              loop={true}
              pagination={{
                clickable: true,
                el: ".custom_bullet",
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {relatedProducts?.map((p, i) => {
                return (
                  <SwiperSlide key={i}>
                    <Link to={`/product/details/${p.slug}`} className="block">
                      <div className="relative ">
                        <div className="mb-4">
                          <img className="w-[200px]" src={p.images[0]} alt="" />
                        </div>
                        {p.discount !== 0 && (
                          <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                            {p.discount}%
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold">{p.name}</h2>
                        <div className="flex justify-start items-center gap-3">
                          <h2 className="text-lg font-bold ">
                            {formatCurrency(p.price)}
                          </h2>
                          <div className="flex">
                            <Rating ratings={p.rating} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <div className="w-full flex justify-center items-center py-8">
            <div className="custom_bullet justify-center gap-3 !w-auto"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Details;
