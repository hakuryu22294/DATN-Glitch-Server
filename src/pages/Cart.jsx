import { Link } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { useContext , useState , useEffect } from "react";
import Header from "../layouts/Header";
import Navigation from '../layouts/Navigation';
import ButtonDefault from "../components/buttons/ButtonDefault";
import { CartContext } from "../hooks/CartContext";
import { formatCurrency } from "../config/formatCurrency";
const Cart = () => {
    const { cart , updateCart , deleteProductCart } = useContext(CartContext);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const calculateSubtotal = () => {
            const total = cart.reduce((acc, item) => acc + item?.price * item.quantity, 0);
            setSubtotal(total);
        };
        calculateSubtotal();
    }, [cart]);
    console.log(subtotal);

  
    return (
        <>
            <Header />
            <Navigation />
            <div className="p-5 bg-[#F2F3F4]">
                {cart && cart?.length > 0 ? (
                    <>
                        <h1 className="font-bold text-[25px]">Giỏ hàng của bạn ({cart?.length})</h1>
                        <div className="bg-[#fff] shadow p-3 rounded-[3px]">
                            <div className="flex justify-between">
                                <img className="w-[50px] " src="https://media3.scdn.vn/img4/2023/02_01/qnTJ0KIyWhbU3ST9aSvM_simg_34545b_120x60_maxb.jpg" alt="" />
                                <span className="block font-bold cursor-pointer">Chat với shop</span>
                            </div>
                            {cart && cart?.map((product) => (
                                <div className="mt-[30px] flex justify-between" key={product.id}>
                                    <div className="flex gap-4">
                                        <div>
                                            <img className="w-[100px]" src={product?.image[0]} alt={product?.image[0]} />
                                        </div>
                                        <div>
                                            <span className="block w-max bg-[#E2E6F2] text-[#1330A2] px-2 rounded-[50px] text-[13px] font-bold">Mua trước trả sau</span>
                                            <span className="bock pt-2">{product?.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex w-[30%] gap-5 items-center">
                                        <span className="font-bold"> {formatCurrency(product?.price)}</span>
                                        <div className="flex">
                                            <button
                                                className="bg-[#dbdbdb] w-[30px] rounded-[4px] text-[20px] h-max"
                                                onClick={() => updateCart(product?.id, -1)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                className="w-[40px]  no-spin pl-4 p-1 mx-2  h-max"
                                                value={product?.quantity}
                                                readOnly
                                            />
                                            <button
                                                className="bg-[#dbdbdb] w-[30px] rounded-[4px] text-[20px]  h-max"
                                                onClick={() => updateCart(product?.id, 1)}
                                                >
                                                +
                                            </button>
                                        </div>
                                        <div>
                                            <FaRegTrashCan className="text-[20px] cursor-pointer" 
                                                onClick={()=>deleteProductCart(product.id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end px-[100px]">
                                <div className="w-[400px] ">
                                    <div className="flex justify-between">
                                        <span className="block]">Tạm tính:</span>
                                        <span className="block font-bold">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div>
                                        <ButtonDefault
                                            nameButton='Mua ngay'
                                            style="bg-[#EE2A28] rounded-[4px] p-2 w-[100%] text-[#fff] font-bold py-3 mt-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center">
                        <div>
                            <img className="w-[500px]" src="https://media3.scdn.vn/img4/2021/02_02/JikA6AqzCC55LcNmcHjZ.png" alt="Giỏ hàng trống" />
                            <p className="text-center font-bold py-2">Giỏ hàng cảm thấy trống trải</p>
                            <p className="text-center">Ai đó ơi, mua sắm để nhận khuyến mãi từ Sendo ngay!</p>
                            <div className="flex justify-center mt-5">
                                <Link to={'/'}>
                                    <ButtonDefault
                                        nameButton='Mua sắm ngay'
                                        style="bg-[#EE2A28] rounded-[4px] p-2 w-[200px] text-[#fff] font-bold"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
