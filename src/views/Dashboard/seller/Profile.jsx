import { useState, useEffect } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import { FadeLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Chart from "react-apexcharts";
import axios from "axios";
import {
  profile_image_upload,
  messageClear,
  get_shop_info,
  profile_info_add,
} from "../../../redux/store/reducers/authReducer";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, loader, successMessage, shopInfo } = useSelector(
    (state) => state.auth
  );

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingProvince, setIsEditingProvince] = useState(false); // State để kiểm soát phần select tỉnh/thành phố
  const [phoneNumber, setPhoneNumber] = useState(
    shopInfo?.shopInfo?.phoneNumber || ""
  );
  const [address, setAddress] = useState(shopInfo?.shopInfo?.address || "");
  const [selectedProvince, setSelectedProvince] = useState(""); // Lưu giá trị tỉnh/thành phố được chọn
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        if (response.data.error === 0) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  console.log(selectedProvince);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);

  const handleEditPhone = () => {
    if (isEditingPhone) {
      dispatch(
        profile_info_add({
          sellerId: shopInfo._id,
          phoneNumber,
          address: shopInfo.shopInfo.address,
        })
      );
    }
    setIsEditingPhone(!isEditingPhone);
  };

  const handleEditAddress = () => {
    if (isEditingAddress) {
      dispatch(
        profile_info_add({
          sellerId: shopInfo._id,
          phoneNumber: shopInfo.shopInfo.phoneNumber,
          address: selectedProvince || address, // Sử dụng địa chỉ từ tỉnh/thành phố được chọn nếu có
        })
      );
    }
    setIsEditingAddress(!isEditingAddress);
    setIsEditingProvince(!isEditingProvince); // Bật chế độ chọn tỉnh/thành phố
  };

  const add_image = (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      dispatch(
        profile_image_upload({ sellerId: shopInfo._id, image: formData })
      );
      dispatch(get_shop_info(userInfo.id));
    }
  };

  const chartData = {
    series: [44, 55, 13, 33],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Orders", "Sales", "Products", "Revenue"],
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "75%",
          },
        },
      },
      legend: {
        position: "right",
        offsetY: 0,
        height: 230,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  };

  return (
    <div className="px-4 py-8 space-y-6">
      <div className="w-full md:w-7/12 lg:w-6/12 mx-auto">
        <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {shopInfo?.avatar ? (
                <label htmlFor="img" className="cursor-pointer">
                  <img
                    src={shopInfo.avatar}
                    alt="Avatar"
                    className="rounded-full w-32 h-32 object-cover border border-primary "
                  />
                  {loader && (
                    <div className="bg-black bg-opacity-50 absolute inset-0 flex justify-center items-center rounded-full">
                      <FadeLoader />
                    </div>
                  )}
                </label>
              ) : (
                <label
                  htmlFor="img"
                  className="rounded-full bg-gray-100 w-32 h-32 flex items-center justify-center cursor-pointer relative"
                >
                  <FaCamera className="text-gray-400 text-2xl" />
                </label>
              )}
              <input
                type="file"
                id="img"
                className="hidden"
                onChange={add_image}
              />
              <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white">
                <FaCamera />
              </button>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{userInfo?.name}</h3>
              <p className="text-sm text-accent">{userInfo?.email}</p>
              <p className="badge badge-accent">{userInfo?.role}</p>
            </div>
          </div>

          {/* Shop Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Shop Information</h4>

            <div>
              <label className="font-semibold">Shop Name</label>
              <input
                type="text"
                value={shopInfo?.shopInfo?.shopName || ""}
                className="input input-bordered w-full mt-1"
                readOnly
              />
            </div>

            <div>
              <label className="font-semibold">Category</label>
              <input
                type="text"
                value={shopInfo?.shopInfo?.category || ""}
                className="input input-bordered w-full mt-1"
                readOnly
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <label className="font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input input-bordered w-full mt-1"
                  readOnly={!isEditingPhone}
                />
              </div>
              <button
                className="btn btn-outline mt-7"
                onClick={handleEditPhone}
              >
                <FaEdit />
              </button>
            </div>

            {/* Address Field */}
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <label className="font-semibold">Address</label>
                {isEditingProvince ? (
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="input input-bordered w-full mt-1"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedProvince || address}
                    className="input input-bordered w-full mt-1"
                    readOnly
                  />
                )}
              </div>
              <button
                className="btn btn-outline mt-7"
                onClick={handleEditAddress}
              >
                <FaEdit />
              </button>
            </div>
          </div>
        </div>

        {/* Donut Chart Section */}
      </div>
    </div>
  );
};

export default Profile;
