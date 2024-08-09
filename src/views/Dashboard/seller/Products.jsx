import { useEffect, useState } from "react";
import Search from "../../components/Search";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { LuImageMinus } from "react-icons/lu";
import { get_products } from "../../../redux/store/reducers/productReducer";
import { formatCurrency } from "../../../utils";

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
  }, [searchValue, currentPage, parPage]);

  return (
    <div className="px-4 lg:px-8 pt-6">
      <h1 className="text-blue-900 font-semibold text-xl mb-4">All Products</h1>

      <div className="w-full p-5 bg-white rounded-md shadow-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto mt-6">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-sm text-gray-600 uppercase bg-blue-100 border-b border-blue-200">
              <tr>
                <th scope="col" className="py-3 px-4">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Image
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Category
                </th>
                <th scope="col" className="py-3 px-4">
                  Brand
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Discount
                </th>
                <th scope="col" className="py-3 px-4">
                  Stock
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products?.map((d, i) => (
                <tr key={d._id} className="bg-white hover:bg-gray-50">
                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    {i + 1}
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    <img
                      className="w-12 h-12 object-cover"
                      src={d.images[0]}
                      alt=""
                    />
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    {d?.name?.slice(0, 15)}...
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    {d.category}
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    {d.brand}
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    {formatCurrency(d.price)}
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    {d.discount === 0 ? (
                      <span className="text-gray-500">No Discount</span>
                    ) : (
                      <span className="text-blue-600"> {d.discount}%</span>
                    )}
                  </td>

                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    {d.stock}
                  </td>

                  <td
                    scope="row"
                    className="py-2 px-4 font-medium whitespace-nowrap"
                  >
                    <div className="flex gap-3">
                      <Link
                        to={`/seller/dashboard/edit-product/${d._id}`}
                        className="p-2 bg-blue-500 rounded hover:bg-blue-400 hover:shadow-lg shadow-blue-300/50"
                      >
                        <FaEdit className="text-white" />
                      </Link>

                      <Link
                        to={`/seller/dashboard/add-banner/${d._id}`}
                        className="p-2 bg-blue-500 rounded hover:bg-blue-400 hover:shadow-lg shadow-blue-300/50"
                      >
                        <LuImageMinus className="text-white" />
                      </Link>

                      <Link className="p-2 bg-blue-500 rounded hover:bg-blue-400 hover:shadow-lg shadow-blue-300/50">
                        <FaEye className="text-white" />
                      </Link>
                      <Link className="p-2 bg-blue-500 rounded hover:bg-blue-400 hover:shadow-lg shadow-blue-300/50">
                        <FaTrash className="text-white" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalProduct <= parPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalProduct}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
