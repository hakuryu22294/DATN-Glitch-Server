import { useEffect, useState } from "react";
import { formatCurrency } from "../../config/formatCurrency";
const Product = (props) => {
    const { image, name, price, quantity, ratingAverage } = props
    const [nameLong, setNameLong] = useState('')

    return (
        <>
            <div className="cursor-pointer group shadow " >
                <img src={image} alt="" className="transition-transform duration-300 group-hover:scale-95" />
                <div className="p-5">
                    <span className="block py-2">{nameLong}</span>
                    <span className="text-rose-500 font-bold">{formatCurrency(price)}</span>
                    <button className="w-full p-1 rounded-[5px]  bg-rose-600 text-[#fff] my-4 hover:bg-rose-500 duration-300">Xem</button>
                    <div className="flex justify-between items-center">
                        <span>Đánh giá {ratingAverage}/</span>
                        <span>Số lượng {quantity}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;