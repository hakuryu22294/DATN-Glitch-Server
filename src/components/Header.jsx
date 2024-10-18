import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import {
  FaMoon,
  FaSun,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
  FaHeart,
  FaHandshake,
  FaShopify,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  get_card_products,
  get_wishlist_products,
} from "../redux/store/reducers/cartReducer";
import { get_category } from "../redux/store/reducers/homeReducer";
import { getUserInfo, logout } from "../redux/store/reducers/authReducer";
import { FaHand, FaShield } from "react-icons/fa6";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.home);
  const { userInfo, shopInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.cart
  );

  const handleLogout = () => {
    dispatch(logout({ navigate, role: userInfo?.role }));
    navigate("/login");
  };

  const [showShidebar, setShowShidebar] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("Tất cả danh mục");
  const [theme, setTheme] = useState(
    JSON.stringify(localStorage.getItem("theme")) || "light"
  );

  const search = () => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };

  const redirect_card_page = () => {
    if (userInfo) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo, dispatch, shopInfo]);

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  const toggleTheme = () => {
    const newTheme = theme === "cupcake" ? "dim" : "cupcake";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="bg-base-200  p-2 text-base-content flex justify-between">
        <div className="hidden md:flex md:w-1/2 items-center space-x-4">
          <div className="flex items-center">
            <MdEmail className="mr-1" />
            <span>support@example.com</span>
          </div>
          <div className="flex items-center">
            <IoMdPhonePortrait className="mr-1" />
            <span>+84 123 456 789</span>
          </div>
        </div>

        {userInfo ? (
          <div className="w-full md:w-1/2 flex justify-center md:justify-end space-x-4 items-center">
            {userInfo.role === "seller" && (
              <Link
                className="flex gap-1 items-center capitalize font-bold border-r-2 pr-2 hover:underline text-secondary"
                to="/seller/dashboard"
              >
                <FaShopify className="text-lg" />
                Quản Lý Cửa Hàng
              </Link>
            )}
            {userInfo.role === "admin" && (
              <Link
                className="flex gap-1 items-center capitalize font-bold border-r-2 pr-2 hover:underline text-secondary"
                to="/admin/dashboard"
              >
                <FaShield className="text-lg" />
                Quản Lý Sàn
              </Link>
            )}
            {userInfo.role === "user" && (
              <Link
                className="flex gap-1 items-center capitalize font-bold border-r-2 pr-2 hover:underline text-secondary"
                to="/seller/register"
              >
                <FaHandshake className="text-lg" />
                Đăng Ký Đối Tác
              </Link>
            )}
            <FaUser className="cursor-pointer" />
            <Link
              to={"/dashboard"}
              className="capitalize font-bold hover:underline text-secondary"
            >
              {userInfo.name}
            </Link>
            <button onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <Link className="capitalize font-bold text-accent" to="/login">
            Đăng Nhập
          </Link>
        )}
      </div>

      <nav className="w-full md:w-[80%] mx-auto flex justify-between items-center p-4 bg-base-100 text-base-content">
        <Link
          to="/"
          className="hidden md:block text-2xl text-base-content font-bold"
        >
          <span className="text-primary">G</span>-commerce
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/">Trang Chủ</Link>
          <Link to="/shopping">Mua sắm</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">Về Chúng Tôi</Link>
          <Link to="/contact">Liên Hệ</Link>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered"
          >
            <option value="Tất cả danh mục">Tất cả danh mục</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="input input-bordered"
          />
          <button className="btn btn-primary" onClick={search}>
            Tìm
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/my-wishlist" className="relative">
            <FaHeart className="text-2xl" />
            {wishlist_count > 0 && (
              <span className="w-5 h-5 bg-rose-500 p-1 flex items-center justify-center rounded-full text-sm font-semibold text-white absolute bottom-3 left-3">
                {wishlist_count}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <FaShoppingBag className="text-2xl" />
            {card_product_count > 0 && (
              <span className="w-5 h-5 bg-rose-500 p-1 flex items-center justify-center rounded-full text-sm font-semibold text-white absolute bottom-3 left-3">
                {card_product_count}
              </span>
            )}
          </Link>
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            {theme === "light" ? (
              <FaMoon className="text-xl fill-current" />
            ) : (
              <FaSun className="text-xl fill-current" />
            )}
          </label>
        </div>
      </nav>
    </header>
  );
};

export default Header;
