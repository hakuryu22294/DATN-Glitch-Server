import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { get_seller_request } from "../../../redux/store/reducers/sellerReducer";

const Sellers = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  const { sellers, totalSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_seller_request(obj));
  }, [searchValue, currentPage, parPage, dispatch]);

  return (
    <div className="px-2  lg:px-7 pt-5">
      <h1 className="text-[20px] font-bold mb-3">Seller</h1>
      <div className="w-full p-4 bg-white shadow-md rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="px-4 py-2 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="px-4 py-2 outline-none border border-slate-700 rounded-md text-[#d0d2d6]"
            type="text"
            placeholder="search"
          />
        </div>

        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {sellers?.map((d, i) => (
            <div key={d._id} className="bg-white p-4 shadow-md rounded-md">
              <h2 className="text-xl font-semibold mb-2">
                {d.shopInfo?.shopName}
              </h2>
              <p className="text-gray-600 mb-1">
                Category: {d.shopInfo?.category}
              </p>
              <p className="text-gray-600 mb-1">Status: {d.status}</p>
              <p className="text-gray-600 mb-4">
                Location: {d.shopInfo?.address}
              </p>
              <div className="flex justify-end">
                <Link
                  to={`/admin/dashboard/seller/details/${d._id}`}
                  className="p-2 bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50 text-white"
                >
                  <FaEye />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {totalSeller > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalSeller}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sellers;
