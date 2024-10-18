import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_featured_products,
  get_products,
} from "../redux/store/reducers/homeReducer";
import FeatureProducts from "../components/products/FeatureProducts";
import Products from "../components/products/Products";
import Banner from "../components/Banner";

const IndexHome = () => {
  const dispatch = useDispatch();
  const {
    latest_product,
    topRated_product,
    discount_product,
    topCategoriesWithProducts,
  } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(get_products());
    dispatch(get_featured_products());
  }, [dispatch]);
  console.log(topCategoriesWithProducts);
  return (
    <>
      <Banner />
      <div className="py-[45px]">
        {topCategoriesWithProducts && (
          <div className="w-[90%] flex flex-col mx-auto">
            {topCategoriesWithProducts.map((category) => (
              <div key={category.category} className="">
                <FeatureProducts
                  products={category.products}
                  title={category.category}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="py-10">
        <div className="w-[85%] flex mx-auto">
          <div className="grid grid-cols-1  lg:grid-cols-3 w-full gap-7">
            <div className="overflow-hidden">
              <Products title="Latest Product" products={latest_product} />
            </div>

            <div className="overflow-hidden">
              <Products title="Top Rated Product" products={topRated_product} />
            </div>

            <div className="overflow-hidden">
              <Products title="Discount Product" products={discount_product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexHome;
