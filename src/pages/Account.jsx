import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { UserProvider } from "../hooks/UserContext";
import Header from '../layouts/Header'
import Navigation from '../layouts/Navigation'
import Footer from '../layouts/Footer'
import AccountUser from "./AccountUser";
import CheckOrder from "./CheckOrder";
const Account = () => {
    const { user } = useContext(UserProvider)
    console.log(user);
    const [content, setContent] = useState(1)
    const handleShowCotent = (next) => {
        setContent(next)
    }
    return (
        <>
            <div>
                <Header />
                <Navigation />
                <div className="p-5 bg-[#F2F3F4] ">
                    <div className="flex gap-3 items-center">
                        <Link>
                            <span className="block text-[#2462FE]">Sendo.vn</span>
                        </Link>
                        <span>/</span>
                        <span className="text-[#6F787E]">Thông tin tài khoản</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-[30%] bg-[#fff] shadow p-5 rounded-[5px]">
                            <div className="flex gap-2 items-center">
                                <img src="../../public/vite.svg" alt="" />
                                <span>{user?.name}</span>
                            </div>
                            <div>
                                <div className="flex gap-2 items-center my-3">
                                    <FaUserCircle className="text-[#3F4B53]" />
                                    <span className="font-bold text-[#3F4B53]">Tài khoản</span>
                                </div>
                                <div>
                                    <span className={`${content === 1 ? 'text-rose-500' : ''} cursor-pointer`} onClick={() => handleShowCotent(1)}>Thông tin tài khoản</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex gap-2 items-center my-3">
                                    <FaClipboardList className="text-[#3F4B53]" />
                                    <span className="font-bold text-[#3F4B53]">Tài khoản</span>
                                </div>
                                <div>
                                    <span className={`${content === 2 ? 'text-rose-500' : 'text-[#3F4B53]'} cursor-pointer`} onClick={() => handleShowCotent(2)}>Sản phẩm</span>
                                </div>
                            </div>
                        </div>
                        {content === 1 && (<AccountUser />)}
                        {content === 2 && (<CheckOrder />)}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Account;
