import { FaList } from "react-icons/fa";
import { useSelector } from "react-redux";
import adminDefault from "../../assets/admin.jpg";
import sellerDefault from "../../assets/seller.png";

const Header = ({ showSidebar, setShowSidebar }) => {
  const { userInfo, shopInfo } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 bg-base-100 z-10 shadow-md ">
      <div className="flex items-center justify-end h-[60px] px-4 transition-all">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-[30px] h-[30px] flex items-center justify-center rounded-md bg-rose-500 text-white shadow-lg hover:shadow-primary-focus cursor-pointer md:hidden"
        >
          <FaList className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col text-end">
              <h2 className="text-sm font-bold text-primary dark:text-gray-200">
                {userInfo?.name}
              </h2>
              <span className="text-xs font-semibold text-secondary dark:text-gray-400">
                {userInfo?.role}
              </span>
            </div>

            <img
              className="w-[50px] h-[50px] rounded-full border-2 border-rose-500"
              src={
                userInfo?.role === "admin"
                  ? adminDefault
                  : shopInfo?.avatar || sellerDefault
              }
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
