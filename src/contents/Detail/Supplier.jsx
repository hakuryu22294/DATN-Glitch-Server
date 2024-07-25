import { Link } from "react-router-dom";
import ButtonDefault from "../../components/buttons/ButtonDefault";
import { BsShopWindow } from "react-icons/bs";
const Supplier = ({shop}) => {
    return (
        <div>
            <h1 className="font-bold">Thông tin nhà cung cấp</h1>
            <div className="pt-[30px]">
                <div className="flex gap-5">
                    <div className="w-[90px] h-[90px] border-2 border-slate-300 flex justify-center items-center rounded-[50%] ">
                        <Link to={`/shop/${shop?.id}`}>
                            <img className="w-[70px] h-[70px] bg-cover rounded-[50px]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRSBBvGsvfKs0iPMSAmuf7zPYiNy0ZfULHOw&s" alt="" />
                        </Link>
                    </div>
                    <Link to={`/shop/${shop?.id}`}>
                        <span className="font-bold text-[16px] block">{shop?.name}</span>
                        <span className="font-bold text-[16px] block">{shop?.email}</span>

                    </Link>
                </div>
                <div>
                    <Link to={`/shop/${shop?.id}`}>
                        <ButtonDefault
                            nameButton="Theo dõi shop"
                            style="bg-[#E7E8EA] p-2 w-full mt-2 rounded-[5px] py-3 font-bold flex items-center justify-center gap-3"
                            icon={<BsShopWindow className="text-[20px]" />}
                        //  onClick
                        />
                    </Link>
                </div>
                <div className="pt-3">
                    <h1 className="font-bold">Gợi ý thêm từ shop</h1>
                    <div className="bg-[#fff] shadow w-max p-2 rounded-[10px] cu">
                        <div className="cursor-pointer">
                            <img className="w-[100px]" src="https://media3.scdn.vn/img4/2022/12_09/S9PxvaUAMNh4Ovv631zH.jpg" alt="" />
                            <span className="block my-2">Bộ thiết kế</span>
                            <span className="block my-2 text-rose-500 font-bold">125.000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Supplier;