import { FaList } from "react-icons/fa";
import { useSelector } from "react-redux";
import adminDefault from "../../assets/admin.jpg";
import sellerDefault from "../../assets/seller.png";
const Header = ({ showSidebar, setShowSidebar }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="fixed top-0 left-0 w-full py-4 px-2 lg:px-4 z-40 bg-white shadow-md">
      <div className="flex items-center justify-between h-[60px] pl-0  md:pl-[260px]  px-4 transition-all">
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-[30px] h-[30px] hidden md:flex items-center justify-center rounded-sm bg-[#9a5ab0] shadow-lg hover:shadow-[#9a5ab0]/50 cursor-pointer"
        >
          <FaList className="text-white text-sm" />
        </div>

        <div className="md:hidden block flex-1 mx-4">
          <input
            className="w-[30%] px-2 py-1 border bg-transparent border-gray-300 rounded-md text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            type="text"
            name="search"
            placeholder="Search"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col text-end">
              <h2 className="text-sm font-bold text-gray-800">
                {userInfo.name}
              </h2>
              <span className="text-xs font-semibold text-gray-600">
                {userInfo.role}
              </span>
            </div>

            <img
              className="w-[50px] h-[50px] rounded-full border-4 border-rose-500"
              src={
                userInfo.role === "admin"
                  ? adminDefault
                  : userInfo.avatar || sellerDefault
              }
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
