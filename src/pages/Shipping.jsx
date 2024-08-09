import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { place_order } from "../redux/store/reducers/orderReducer";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils";

const Shipping = () => {
  const {
    state: { products, price, shipping_fee, items },
  } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [res, setRes] = useState(false);
  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
  });

  // State for select options
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    // Fetch provinces
    axios.get("https://esgoo.net/api-tinhthanh/1/0.htm").then((response) => {
      if (response.data.error === 0) {
        setProvinces(response.data.data);
      }
    });
  }, []);

  useEffect(() => {
    // Fetch districts when province changes
    if (state.province) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${state.province.id}.htm`)
        .then((response) => {
          if (response.data.error === 0) {
            setDistricts(response.data.data);
            setWards([]); // Clear wards when province changes
            setState((prevState) => ({
              ...prevState,
              district: "",
              ward: "",
            }));
          }
        });
    }
  }, [state.province]);

  useEffect(() => {
    // Fetch wards when district changes
    if (state.district) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${state.district.id}.htm`)
        .then((response) => {
          if (response.data.error === 0) {
            setWards(response.data.data);
          }
        });
    }
  }, [state.district]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  console.log(state);

  const handleProvinceChange = (e) => {
    const selectedProvince = provinces.find(
      (province) => province.id === e.target.value
    );
    setState((prevState) => ({
      ...prevState,
      province: selectedProvince,
      district: "",
      ward: "",
    }));
    setDistricts([]);
    setWards([]);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = districts.find(
      (district) => district.id === e.target.value
    );
    setState((prevState) => ({
      ...prevState,
      district: selectedDistrict,
      ward: "",
    }));
    setWards([]);
  };

  const handleWardChange = (e) => {
    const selectedWard = wards.find((ward) => ward.id === e.target.value);
    setState((prevState) => ({ ...prevState, ward: selectedWard }));
  };

  const save = (e) => {
    e.preventDefault();
    const { name, address, phone, province, district, ward } = state;
    if (name && address && phone && province && district && ward) {
      setRes(true);
    } else {
      setRes(false);
      toast.success("Please fill all the fields");
    }
  };

  const placeOrder = () => {
    dispatch(
      place_order({
        price,
        products,
        shipping_fee,
        items,
        shippingInfo: state,
        userId: userInfo.id,
        navigate,
      })
    );
  };

  return (
    <div>
      <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <h2 className="text-3xl font-bold">Shipping Page</h2>
              <div className="flex justify-center items-center gap-2 text-2xl w-full">
                <Link to="/">Home</Link>
                <span className="pt-1">
                  <IoIosArrowForward />
                </span>
                <span>Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eeeeee]">
        <div className="w-[90%] lg:w-[85%] mx-auto py-16">
          <div className="flex flex-row lg:flex-col gap-8">
            {/* Shipping Information */}
            <div className="w-full lg:w-8/12 bg-white p-6 shadow-md rounded-md">
              <h2 className="text-slate-600 font-bold text-xl mb-6">
                Thông Tin Vận Chuyển
              </h2>

              {!res && (
                <form onSubmit={save}>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="name" className="font-semibold">
                        Tên
                      </label>
                      <input
                        onChange={inputHandle}
                        value={state.name}
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                        name="name"
                        id="name"
                        placeholder="Tên"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="address" className="font-semibold">
                        Địa chỉ
                      </label>
                      <input
                        onChange={inputHandle}
                        value={state.address}
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                        name="address"
                        id="address"
                        placeholder="Địa chỉ"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="phone" className="font-semibold">
                        Số điện thoại
                      </label>
                      <input
                        onChange={inputHandle}
                        value={state.phone}
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                        name="phone"
                        id="phone"
                        placeholder="Số điện thoại"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="province" className="font-semibold">
                        Tỉnh/Thành phố
                      </label>
                      <select
                        id="province"
                        name="province"
                        value={state.province?.id || ""}
                        onChange={handleProvinceChange}
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                      >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        {provinces.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="district" className="font-semibold">
                        Quận/Huyện
                      </label>
                      <select
                        id="district"
                        name="district"
                        value={state.district?.id || ""}
                        onChange={handleDistrictChange}
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="ward" className="font-semibold">
                        Phường/Xã
                      </label>
                      <select
                        id="ward"
                        name="ward"
                        value={state.ward?.id || ""}
                        onChange={handleWardChange}
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                      >
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map((ward) => (
                          <option key={ward.id} value={ward.id}>
                            {ward.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 px-6 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-4/12 bg-white p-6 shadow-md rounded-md">
              <h2 className="text-slate-600 font-bold text-xl mb-6">
                Tóm Tắt Đơn Hàng
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(price.toFixed(2))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>{formatCurrency(shipping_fee.toFixed(2))}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span>
                    {formatCurrency((price + shipping_fee).toFixed(2))}
                  </span>
                </div>
                <button
                  onClick={placeOrder}
                  className="w-full mt-4 px-6 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
