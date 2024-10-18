import { useState, useEffect, lazy, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";

import { FaLocationDot, FaBasketShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  get_shop_data,
  price_range_product,
  query_products,
} from "../redux/store/reducers/homeReducer";
import debounce from "lodash.debounce";

import Pagination from "../components/Pagination";
import LoadingSpinners from "./LoadingSpinners";
const ShopProducts = lazy(() => import("../components/products/ShopProducts"));

const ShopPage = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const { priceRange, parPage, subCategory, shopData, loader } = useSelector(
    (state) => state.home
  );
  const { products } = useSelector((state) => state.product);

  const [filter, setFilter] = useState(true);
  const [state, setState] = useState({
    values: [priceRange.low, priceRange.high],
  });
  const [rating, setRating] = useState("");
  const [styles, setStyles] = useState("grid");
  const [pageNumber, setPageNumber] = useState(1);
  const [sortPrice, setSortPrice] = useState("");
  const [activeTab, setActiveTab] = useState(""); // Track current tab

  useEffect(() => {
    dispatch(get_shop_data({ sellerId }));
  }, [dispatch, sellerId]);

  useEffect(() => {
    dispatch(price_range_product());
  }, [dispatch]);

  useEffect(() => {
    setState({ values: [priceRange.low, priceRange.high] });
  }, [priceRange]);

  const debouncedQueryProducts = useCallback(
    debounce((filterOptions) => {
      dispatch(query_products(filterOptions));
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedQueryProducts({
      low: state.values[0],
      high: state.values[1],
      rating,
      sortPrice,
      pageNumber,
      subCategory,
    });
  }, [
    rating,
    sortPrice,
    pageNumber,
    debouncedQueryProducts,
    state.values,
    subCategory,
  ]);

  const resetRating = () => {
    setRating("");
    dispatch(
      query_products({
        low: state.values[0],
        high: state.values[1],
        rating: "",
        sortPrice,
        pageNumber,
        subCategory,
      })
    );
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    setState((prevState) => ({
      ...prevState,
      subCategory: selectedSubCategory,
    }));
  };
  if (loader) return <LoadingSpinners />;

  return (
    <div className="w-[95%] md:w-[85%] mx-auto">
      <div className="w-full p-4 shadow-md text-base-content bg-base-300 h-full mx-auto rounded-lg">
        <h1 className="text-3xl font-bold">
          {shopData?.shop?.shopInfo?.shopName}
        </h1>
        <p className="">
          <FaLocationDot className="inline mr-3" />
          <span>{shopData?.shop?.shopInfo?.address}</span>
        </p>
        <p>
          <FaBasketShopping className="inline mr-3" />
          <span>Số sản phẩm: {shopData?.totalProducts}</span>
        </p>
      </div>

      <section className="py-16 relative">
        <div className="h-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className={`block md:hidden ${!filter ? "mb-6" : "mb-0"}`}>
            <button
              onClick={() => setFilter(!filter)}
              className="text-center w-full py-2 px-3 bg-indigo-500 text-white"
            >
              Filter Product
            </button>
          </div>
          <div>
            {filter && (
              <div className="w-full p-4 bg-base-300 shadow-lg rounded-md">
                <h2 className="text-lg font-bold text-base-content mb-3">
                  Bộ Lọc Sản Phẩm
                </h2>
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">
                    Lọc Theo Đánh Giá
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[5, 4, 3, 2, 1].map((rate) => (
                      <div
                        key={rate}
                        className="flex items-center cursor-pointer"
                        onClick={() => setRating(rate)}
                      >
                        <div className="flex items-center gap-1 text-yellow-400">
                          {Array.from({ length: rate }).map((_, index) => (
                            <AiFillStar key={index} />
                          ))}
                          {Array.from({ length: 5 - rate }).map((_, index) => (
                            <CiStar key={index} />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{`Từ ${rate} sao`}</span>
                      </div>
                    ))}
                    <button
                      className="text-sm text-red-500 mt-2"
                      onClick={resetRating}
                    >
                      Xóa bộ lọc đánh giá
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">
                    Lọc Theo Danh Mục Con
                  </h3>
                  <select
                    onChange={handleSubCategoryChange}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Chọn danh mục con</option>
                    {shopData?.shop?.subCategories?.map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-3">
            <div className="pl-8 md:pl-0">
              <div className="py-4 bg-base-300 mb-10 px-3 rounded-md flex justify-between items-start border">
                <h2 className="text-lg font-medium text-base-content"> </h2>
                <div className="flex justify-center items-center gap-3">
                  <select
                    onChange={(e) => setSortPrice(e.target.value)}
                    className="p-1 border outline-0 text-slate-600 font-semibold"
                  >
                    <option value="">Sort By</option>
                    <option value="low-to-high">Low to High Price</option>
                    <option value="high-to-low">High to Low Price</option>
                  </select>
                </div>
              </div>

              {/* Tabs for Subcategories */}
              <div className="tabs" role="tablist">
                {shopData?.shop?.subCategories?.map((subCategory) => (
                  <a
                    key={subCategory}
                    className={`tab tabs tabs-lifted ${
                      activeTab === subCategory ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab(subCategory)}
                  >
                    {subCategory}
                  </a>
                ))}
              </div>

              {/* Display products based on active tab */}
              {shopData?.products && activeTab && (
                <ShopProducts products={shopData.products[activeTab]} />
              )}

              <div className="mt-10 flex justify-end">
                {products.length > parPage && (
                  <Pagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalItem={products.length}
                    parPage={parPage}
                    showItem={Math.floor(products.length / parPage)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
