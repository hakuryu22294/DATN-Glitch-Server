import SvgLogo from "../config/icons/SvgLogo";
import SvgQr from "../config/icons/SvgQr";
import Categories from "../components/ListCategories/Categories";
import SearchHome from "../components/Search/SearchHome";
import { FaCartShopping } from "react-icons/fa6";
import ButtonDefault from "../components/buttons/ButtonDefault";
import { useContext } from "react";
import { TabContent } from "../hooks/TabUiContext";
import { ShowUiContext } from "../hooks/ShowUiContext";
import { ShowUiContext } from "../hooks/ShowUiContext";
import { UserProvider } from "../hooks/UserContext";
import { CartContext } from "../hooks/CartContext";

const Navigation = () => {
    const { handleTabUi, tab } = useContext(TabContent)
    const {handleToogleForm} = useContext(ShowUiContext)
     const { user } = useContext(UserProvider)
    const { cart } = useContext(CartContext)
    const listCate = [
        {
            nameCategories: "Cho bạn",
            tab: 1
        },
        {
            nameCategories: "Dồ dùng nhà bếp",
            tab: 2
        },
        {
            nameCategories: "Vệ sinh, chăm sóc nhà cửa",
            tab: 3
        },
        {
            nameCategories: "Đầm váy",
            tab: 4

        },
        {
            nameCategories: "Áo nữ",
            tab: 5

        },
        {
            nameCategories: "Dụng cụ làm vườn",
            tab: 5
        },


    ]
      const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        window.location.reload()

    }
    return (
        <>
            <div className="bg-[#ee2624] px-4  w-full">
                <div className="w-[95%] m-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <SvgLogo />
                            <div className="relative group">
                                <SvgQr />
                                <div className="absolute left-[-140px] bottom-[-110px] hidden group-hover:block">
                                    <Categories />
                                </div>
                            </div>
                        </div>
                             <div className="flex gap-4 items-center ">
                            <SearchHome />
                              <div className="relative">
                                 <Link to={'/cart'}>
                                 <FaCartShopping className="text-[30px] text-[#fff] cursor-pointer " />
                                 </Link>
                                <div className="absolute top-[-10px] right-[-10px]">
                                    <span className="bg-rose-500 text-[#fff] font-bold w-[20px] h-[20px] flex justify-center items-center rounded-[50%]">{cart.length}</span>
                                </div>
                            </div>
                            {!user || user === null ? (
                                <>
                                    <ButtonDefault
                                        onClick={() => handleToogleForm('login')}
                                        nameButton="Đăng nhập"
                                        style={'bg-[#fff] p-[7px] px-5 rounded-[7px] font-bold text-[#2e2e2e]'}
                                    />
                                    <ButtonDefault
                                        onClick={() => handleToogleForm('register')}
                                        nameButton="Đăng ký"
                                        style={'bg-[#fff] p-[7px] px-5 rounded-[7px] font-bold text-[#2e2e2e]'}
                                    />


                                </>
                            ) : (
                                <>
                                    <div className=" relative group">
                                        <div className="flex bg-[#ffffff] items-center gap-2 rounded-[40px] p-1 px-2 cursor-pointer w-[150px] justify-start ">
                                            <img className="w-[30px]" src="https://media3.scdn.vn/images/apps/icon_user_default.png" alt="" />
                                            <span className="text-[#333] font-bold">{user.name}</span>
                                        </div>
                                        <div className="absolute bg-[#fff] shadow p-5 w-[300px] left-0 top-[40px] rounded-[5px] hidden group-hover:block  ">
                                            <div>
                                                <span className="block duration-300 rounded-[5px] py-2 px-2 hover:bg-[#eeeeee] mb-1 cursor-pointer">Thông tin tài khoản</span>
                                                <span className="block duration-300 rounded-[5px]  py-2 px2 hover:bg-[#eeeeee] mb-2 cursor-pointer">Theo dõi đơn hàng</span>
                                            </div>
                                            <div>
                                                <ButtonDefault
                                                    onClick={() => handleLogout()}
                                                    nameButton="Đăng xuất"
                                                    style={'bg-[#fff] p-[7px] px-5 rounded-[7px] font-bold text-[#2e2e2e] border-2 w-full border-slate-200'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center  pt-2 w-[85%] m-auto justify-between">
                        {listCate.map((cate, index) => (
                            <>
                                <div>
                                    <div onClick={() => handleTabUi(cate.tab)} key={index} className="hover:bg-[#F1514F] cursor-pointer px-5 py-4 duration-200">
                                        <span className="text-[#fff] font-semibold">{cate.nameCategories}</span>

                                    </div>
                                    <div className={`${cate.tab === tab ? "w-[100%] h-[2px] bg-[#fff] duration-300" : ""}`}></div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
};

export default Navigation;
