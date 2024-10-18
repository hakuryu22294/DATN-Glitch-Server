import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  get_pending_sellers,
  seller_status_update,
} from "../../../redux/store/reducers/sellerReducer";

const DeactiveSellers = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  const { sellers } = useSelector((state) => state.seller);
  const handleActiveSeller = (id) => {
    dispatch(seller_status_update({ sellerId: id, status: "active" }));
  };
  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_pending_sellers(obj));
  }, [searchValue, currentPage, parPage]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Active Seller</h1>

      <div className="card shadow-md bg-base-200 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-5">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="select select-bordered select-sm max-w-xs"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="input input-bordered input-sm w-full max-w-xs"
            type="text"
            placeholder="Search"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead className="bg-neutral text-neutral-content">
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Shop Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>District</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers?.map((d, i) => (
                <tr key={i} className="hover:bg-base-100">
                  <td>{i + 1}</td>
                  <td>{d.userId.name}</td>
                  <td>{d.shopInfo?.shopName}</td>
                  <td>{d.userId.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        d.status === "active" ? "badge-success" : "warning"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>{d.shopInfo?.address}</td>
                  <td>
                    <button
                      onClick={() => handleActiveSeller(d._id)}
                      className="btn btn-primary items-center gap-2"
                    >
                      active
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-end">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={sellers?.length}
            parPage={parPage}
            showItem={3}
          />
        </div>
      </div>
    </div>
  );
};

export default DeactiveSellers;
