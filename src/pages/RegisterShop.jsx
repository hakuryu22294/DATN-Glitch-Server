import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  seller_register,
  messageClear,
  reset_token,
} from "../redux/store/reducers/authReducer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterShop = () => {
  const { categories } = useSelector((state) => state.home);
  const { userInfo, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );
  console.log(userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState({
    shopName: "",
    address: "",
    category: "",
  });

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
  console.log(provinces);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(reset_token());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, successMessage, errorMessage, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(seller_register({ shopInfo, userId: userInfo.id }));
  };

  return (
    <div>
      <Header />
      <section className="bg-base-100 min-h-screen py-12">
        <div className="w-[90%] lg:w-[70%] mx-auto bg-base-300 p-8 shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-base-content">
            Đăng Ký Cửa Hàng
          </h1>
          <p className="text-center mb-8 text-base-content">
            Chào mừng bạn đến với trang đăng ký cửa hàng. Vui lòng điền thông
            tin dưới đây để đăng ký cửa hàng của bạn.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Shop Name */}
              <div>
                <label htmlFor="shopName" className="block font-semibold mb-1">
                  Tên cửa hàng
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={shopInfo.shopName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nhập tên cửa hàng"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block font-semibold mb-1">
                  Địa chỉ
                </label>
                <select
                  id="address"
                  name="address"
                  value={shopInfo.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.full_name}>
                      {province.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items */}
              <div>
                <label htmlFor="items" className="block font-semibold mb-1">
                  Mặt hàng buôn bán
                </label>
                <select
                  id="category"
                  name="category"
                  value={shopInfo.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Chọn mặt hàng</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default RegisterShop;
