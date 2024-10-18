import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ShopProducts from "../components/products/ShopProducts";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { query_products } from "../redux/store/reducers/homeReducer";

const SearchProducts = () => {
  let [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchValue = searchParams.get("value");

  const dispatch = useDispatch();
  const { products, totalProduct, parPage } = useSelector(
    (state) => state.home
  );

  const [styles, setStyles] = useState("grid");
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    dispatch(
      query_products({
        category,
        searchValue,
        pageNumber,
      })
    );
  }, [category, searchValue, pageNumber, dispatch]);

  return (
    <div>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-base-300 shadow-md rounded-lg p-4 mb-8">
            <h2 className="text-lg font-medium text-base-content">
              ({totalProduct}) sản phẩm được tìm thấy
            </h2>
          </div>

          <div className="pb-8">
            <ShopProducts products={products} styles={styles} />
          </div>

          {totalProduct > parPage && (
            <Pagination
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalItem={totalProduct}
              parPage={parPage}
              showItem={Math.floor(totalProduct / parPage)}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchProducts;
