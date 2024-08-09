import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getNav } from "../navigation/index";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

import logo from "../../assets/logo.png";
import { logout } from "../../redux/store/reducers/authReducer";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [allNav, setAllNav] = useState([]);
  useEffect(() => {
    const navs = getNav(userInfo.role);
    setAllNav(navs);
  }, [userInfo]);

  return (
    <div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${
          !showSidebar ? "invisible" : "visible"
        } w-screen h-screen bg-gray-700 bg-opacity-50 top-0 left-0 z-10`}
      ></div>

      <div
        className={`fixed top-0 h-screen bg-gray-100 z-50 shadow-md transition-all ${
          showSidebar ? "left-0" : "-left-[300px]"
        } left-0 md:-left-300 w-[300px] ${
          showSidebar ? "xl:left-0" : "xl:-left-[300px]"
        }  block lg:hidden`}
      >
        <div className="h-[70px] flex justify-center items-center bg-rose-500">
          <Link to="/" className="w-[180px] h-[50px]">
            <img
              className="w-full h-full object-contain"
              src={logo}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-2">
          <ul>
            {allNav.map((n, i) => (
              <li key={i}>
                <Link
                  to={n.path}
                  className={`${
                    pathname === n.path
                      ? "bg-rose-600 text-white shadow-md"
                      : "text-gray-800 font-bold hover:bg-rose-200"
                  } px-4 py-2 rounded-sm flex items-center gap-3 transition-all duration-300`}
                >
                  <span>{n.icon}</span>
                  <span>{n.title}</span>
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={() => dispatch(logout(navigate, userInfo.role))}
                className="text-gray-800 font-bold hover:bg-red-200 px-4 py-2 rounded-sm flex items-center gap-3 transition-all duration-300"
              >
                <span>
                  <BiLogOutCircle />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
