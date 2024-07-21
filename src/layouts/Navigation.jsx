import SvgLogo from "../config/icons/SvgLogo";
import SvgQr from "../config/icons/SvgQr";
import Categories from "../components/ListCategories/Categories";
import SearchHome from "../components/Search/SearchHome";
import { FaCartShopping } from "react-icons/fa6";
import ButtonDefault from "../components/buttons/ButtonDefault";
import { useContext } from "react";
import { TabContent } from "../hooks/TabUiContext";
import { ShowUiContext } from "../hooks/ShowUiContext";
const Navigation = () => {
    const { handleTabUi, tab } = useContext(TabContent)
    const {handleToogleForm} = useContext(ShowUiContext)

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
                            <FaCartShopping className="text-[30px] text-[#fff] " />

                            <ButtonDefault
                                  onClick={()=>handleToogleForm('login')}
                                nameButton="Đăng nhập"
                                style={'bg-[#fff] p-[7px] px-5 rounded-[7px] font-bold text-[#2e2e2e]'}
                            />
                            <ButtonDefault
                                onClick={()=>handleToogleForm('register')}
                                nameButton="Đăng ký"
                                style={'bg-[#fff] p-[7px] px-5 rounded-[7px] font-bold text-[#2e2e2e]'}
                            />
                            
                          
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