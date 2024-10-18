import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getNav } from "../navigation/index";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/store/reducers/authReducer";
const role = {
  admin: "Admin",
  shipper: "Shipper",
  seller: "Seller",
};
const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [allNav, setAllNav] = useState([]);
  useEffect(() => {
    const navs = getNav(userInfo?.role);
    setAllNav(navs);
  }, [userInfo]);

  return (
    <div className="hidden lg:block z-50">
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${
          !showSidebar ? "invisible" : "visible"
        } w-screen h-screen bg-opacity-50 top-0 left-0 z-10`}
      ></div>

      <div
        className={`fixed top-0 h-screen bg-base-100 z-50  transition-all ${
          showSidebar ? "left-0" : "-left-[300px]"
        } left-0 -left-300 w-[300px] ${
          showSidebar ? "left-0" : "-left-[300px]"
        }  hidden lg:block`}
      >
        <div className="h-[70px] flex justify-center mb-4 items-center">
          <Link to="/" className="w-[180px] h-[50px]">
            <h2 className="text-2xl p-4 font-bold flex justify-center items-center">
              <div className="w-10 h-10 mr-3 rounded-lg flex justify-center items-center shadow-md bg-primary text-white">
                G
              </div>
              <span className="text-primary flex justify-center items-center h-10">
                {role[userInfo?.role]}
              </span>
            </h2>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-2">
          <ul>
            {allNav.map((n, i) => (
              <li key={i}>
                <Link
                  to={n.path}
                  className={` font-bold hover:bg-primary hover:text-white px-4 py-2 rounded-sm flex items-center gap-3 transition-all duration-300 ${
                    pathname === n.path ? "bg-primary text-white" : ""
                  }`}
                >
                  <span>{n.icon}</span>
                  <span>{n.title}</span>
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={() =>
                  dispatch(logout({ navigate, role: userInfo?.role }))
                }
                className="font-bold hover:bg-warning hover:text-white px-4 py-2 rounded-sm flex items-center gap-3 transition-all duration-300"
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
