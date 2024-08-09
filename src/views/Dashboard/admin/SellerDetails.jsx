import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  get_seller,
  seller_status_update,
  messageClear,
} from "../../../redux/store/reducers/sellerReducer";
import avtDefault from "../../../assets/user.png";
import toast from "react-hot-toast";

const SellerDetails = () => {
  const dispatch = useDispatch();
  const { seller, successMessage } = useSelector((state) => state.seller);
  const { sellerId } = useParams();
  console.log(seller);
  useEffect(() => {
    dispatch(get_seller(sellerId));
  }, [sellerId]);

  const [status, setStatus] = useState("");
  const submit = (e) => {
    e.preventDefault();
    dispatch(
      seller_status_update({
        sellerId,
        status,
      })
    );
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage]);

  useEffect(() => {
    if (seller) {
      setStatus(seller.status);
    }
  }, [seller]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[20px] font-bold mb-3"> Seller Details </h1>
      <div className="w-full p-4 bg-white rounded-md shadow-md">
        <div className="w-full flex flex-wrap text-[#d0d2d6]">
          <div className="w-3/12 flex justify-center items-center py-3">
            <div>
              {seller?.image ? (
                <img
                  className="w-full h-[230px]"
                  src={seller?.image}
                  alt="default avt"
                />
              ) : (
                <img
                  className="w-full h-[230px]"
                  src={avtDefault}
                  alt="default avt"
                />
              )}
            </div>
          </div>

          <div className="w-4/12">
            <div className="px-0 md:px-5 py-2">
              <div className="py-2 text-lg">
                <h2 className="font-bold text-black">Basic Info</h2>
              </div>

              <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-gray-100  rounded-md shadow-md">
                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>Name : </span>
                  <span>{seller?.name} </span>
                </div>
                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>Email : </span>
                  <span>{seller?.email}</span>
                </div>

                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>Role : </span>
                  <span>{seller?.role} </span>
                </div>
                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>Status : </span>
                  <span>{seller?.status} </span>
                </div>
                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>Payment Status : </span>
                  <span>{seller?.payment} </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-4/12">
            <div className="px-0 md:px-5 py-2">
              <div className="py-2 text-lg">
                <h2 className="font-bold text-black">Address</h2>
              </div>

              <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-gray-100 shadow-md  rounded-md">
                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>Shop Name : </span>
                  <span>{seller?.shopInfo?.shopName || "N/a"} </span>
                </div>
                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>Divission : </span>
                  <span>{seller?.shopInfo?.division || "N/a"} </span>
                </div>

                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>District : </span>
                  <span>{seller?.shopInfo?.district || "N/a"} </span>
                </div>
                <div className="flex gap-2 font-bold text-[#000000]">
                  <span>State : </span>
                  <span>{seller?.shopInfo?.sub_district || "N/a"} </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={submit}>
            <div className="flex gap-4 py-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 focus:border-rose-500 outline-none border border-slate-700 rounded-md text-[#d0d2d6]"
                name=""
                id=""
                required
              >
                <option value="">--Select Status--</option>
                <option value="active">Active</option>
                <option value="deactive">Deactive</option>
              </select>
              <button className="bg-rose-500 w-[170px] hover:shadow-red-500/40 hover:shadow-md text-white rounded-md px-7 py-2">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;
