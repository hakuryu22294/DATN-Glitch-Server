import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  place_order,
  messageClear,
  add_shipping_info,
} from "../redux/store/reducers/orderReducer";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils";
import { FaPhoneAlt, FaShippingFast, FaUser } from "react-icons/fa";
import { get_user_info } from "../redux/store/reducers/authReducer";
import { FaLocationDot } from "react-icons/fa6";
import {
  check_cart_before_buy,
  get_card_products,
} from "../redux/store/reducers/cartReducer";

const Shipping = () => {
  const {
    state: { products, price, shipping_fee, items },
  } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userFull } = useSelector((state) => state.auth);
  const { card_products } = useSelector((state) => state.cart);
  const [res, setRes] = useState(false);
  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // Default to COD

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

  const checkCartPrePayment = async () => {
    dispatch(get_card_products(userInfo.id));
    dispatch(check_cart_before_buy({ cartItems: card_products }));
    const result = await dispatch(
      check_cart_before_buy({ cartItems: card_products })
    );
    return result;
  };

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
      if (userInfo) {
        dispatch(
          add_shipping_info({
            customerId: userInfo.id,
            shippingData: {
              ...state,
              province: province.full_name,
              district: district.full_name,
              ward: ward.full_name,
            },
          })
        )
          .unwrap()
          .then(() => {
            toast.success("Shipping address added successfully");
            dispatch(messageClear());
            dispatch(get_user_info(userInfo.id));
          })
          .catch((error) => {
            toast.error(`Failed to add shipping address: ${error.message}`);
            dispatch(messageClear());
          });
      } else {
        toast.error("Maximum 3 shipping addresses reached");
      }
    } else {
      toast.error("Please fill all the fields");
    }
  };

  const placeOrder = async () => {
    const shippingInfo = selectedAddress
      ? selectedAddress
      : {
          ...state,
          province: state.province.full_name,
          district: state.district.full_name,
          ward: state.ward.full_name,
        };

    const isCheckSuccessful = await checkCartPrePayment();
    console.log(isCheckSuccessful);

    if (isCheckSuccessful.error) {
      navigate("/cart");
      toast.error("Một số sản phẩm trong giỏ hàng đã bị thay đổi.");
    } else {
      dispatch(
        place_order({
          price,
          products,
          shipping_fee,
          items,
          shippingInfo,
          userId: userInfo.id,
          paymentMethod,
          navigate,
        })
      );
    }
  };

  return (
    <div>
      <section>
        <div className="w-[90%] lg:w-[85%] mx-auto py-16">
          <h2 className="text-base-content font-bold text-3xl mb-6">
            Địa điểm giao hàng
            <FaShippingFast className="inline-block ml-2" />
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Shipping Information */}
            <div className="w-full lg:w-8/12 bg-base-300 p-6 shadow-md rounded-md">
              <h2 className="text-base-content font-bold text-xl mb-6">
                Thông Tin Vận Chuyển
              </h2>
              <div className="grid grid-col-1 md:grid-cols-2 gap-5">
                {userFull?.shippingInfo?.map((info, index) => (
                  <div
                    className="flex flex-col gap-1 p-4 text-sm rounded-md bg-base-100 shadow-md"
                    key={index}
                  >
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="shippingAddress"
                      value={JSON.stringify(info)}
                      onChange={(e) =>
                        setSelectedAddress(JSON.parse(e.target.value))
                      }
                    />
                    <label
                      htmlFor={`address-${index}`}
                      className="flex flex-col gap-1 cursor-pointer"
                    >
                      <p className="flex items-center gap-2">
                        <FaUser /> <span>{info.name}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaPhoneAlt />
                        <span>{info.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaLocationDot />
                        <span>
                          {info.address} - {info.province} - {info.district} -{" "}
                          {info.ward}
                        </span>
                      </p>
                    </label>
                  </div>
                ))}
              </div>
              {!selectedAddress && !res ? (
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
                        onChange={handleProvinceChange}
                        value={state.province ? state.province.id : ""}
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
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
                        onChange={handleDistrictChange}
                        value={state.district ? state.district.id : ""}
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                        disabled={!state.province}
                      >
                        <option value="">Chọn quận/huyện</option>
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
                        onChange={handleWardChange}
                        value={state.ward ? state.ward.id : ""}
                        className="w-full px-4 py-2 border border-slate-300 outline-none focus:border-green-500 rounded-md"
                        disabled={!state.district}
                      >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((ward) => (
                          <option key={ward.id} value={ward.id}>
                            {ward.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn bg-green-500 hover:bg-green-600 text-white"
                      >
                        Lưu địa chỉ
                      </button>
                    </div>
                  </div>
                </form>
              ) : null}
            </div>
            {/* Order Summary */}
            <div className="w-full lg:w-4/12 bg-base-300 p-6 shadow-md rounded-md">
              <h2 className="text-base-content font-bold text-xl mb-6">
                Tóm tắt đơn hàng
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(price)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Phí giao hàng:</span>
                  <span>{formatCurrency(shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Thành tiền:</span>
                  <span>{formatCurrency(price + shipping_fee)}</span>
                </div>
                {/* Payment Method */}
                <div className="mt-4">
                  <h3 className="font-semibold">Phương thức thanh toán</h3>
                  <div className="flex flex-col mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="VNPay"
                        checked={paymentMethod === "vnPay"}
                        onChange={() => setPaymentMethod("vnPay")}
                      />
                      VNPay
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="COD"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      COD (Tiền mặt khi nhận hàng)
                    </label>
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  className={`btn mt-4 w-full ${
                    selectedAddress
                      ? "bg-blue-500"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!selectedAddress}
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipping;
