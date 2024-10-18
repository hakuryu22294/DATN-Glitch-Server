import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import avt from "../../../assets/avt.png";
import { get_seller_stast_by_admin } from "../../../redux/store/reducers/dashboardReducer";

const Sellers = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  const { sellers, totalSeller } = useSelector((state) => state.seller);
  const { sellerStats } = useSelector((state) => state.dashboard);
  console.log(sellerStats);
  useEffect(() => {
    dispatch(get_seller_stast_by_admin());
  }, [dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-3xl font-bold mb-5 text-primary">Sellers</h1>
      <div className="w-full bg-base-100 shadow-md rounded-md mb-6 p-6">
        <div className="flex justify-between items-center mb-6">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="5">Show 5</option>
            <option value="10">Show 10</option>
            <option value="20">Show 20</option>
          </select>
          <input
            type="text"
            placeholder="Search seller..."
            className="input input-bordered w-full max-w-xs"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerStats?.map((seller) => (
            <div key={seller._id} className="card w-full bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <img
                    className="w-16 h-16 rounded-full shadow-md mr-4"
                    src={seller.avatar ? seller.avatar : avt}
                    alt="avatar"
                  />
                  <div>
                    <h2 className="card-title">{seller.shopInfo?.shopName}</h2>
                    <p className="text-gray-500">
                      {seller.shopInfo?.address || "No address provided"}
                    </p>
                  </div>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal shadow">
                  {/* Doanh thu */}
                  <div className="stat">
                    <div className="stat-title">Revenue</div>
                    <div className="stat-value text-xl text-success">
                      {seller.totalRevenue.toLocaleString() || 0} VND
                    </div>
                  </div>
                  {/* Tỉ lệ hoàn thành đơn */}
                  <div className="stat">
                    <div className="stat-title">Order Completion</div>
                    <div className="stat-value text-xl text-info">
                      {seller.completionRate.toFixed(2) || 0}%
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/admin/dashboard/seller/details/${seller._id}`}
                    className="btn btn-primary btn-outline"
                  >
                    <FaEye className="mr-2" /> View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        {totalSeller > parPage && (
          <div className="w-full flex justify-end mt-8">
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
