import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../services/productService/productService";
import Header from "../layouts/Header";
import Navigation from "../layouts/Navigation";
import { formatCurrency } from "../config/formatCurrency";
import Policy from "../components/Detail/Policy";
import Description from "../components/Detail/Description";
import ButtonDefault from "../components/buttons/ButtonDefault";
import { showToastSuccess } from "../config/toastConfig";
const Detailproduct = () => {
  const { id } = useParams();
  const [detailproduct, setDetailproduct] = useState({});
  const [pickColor, setPickColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getDataDetailProduct = async () => {
      const dataProduct = await ProductService.GetDetailProduct(String(id));
      setDetailproduct(dataProduct);
    };
    getDataDetailProduct();
  }, [id]);

  const handlePickColor = (color) => {
    setPickColor(pickColor === color ? null : color);
  };

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === detailproduct.id);

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...detailproduct, quantity });
    }
    showToastSuccess(`Đã thêm sản phẩm vào giỏ hàng`)

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const updateCart = (id, delta) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === id);

    if (productIndex >= 0) {
      cart[productIndex].quantity += delta;
      if (cart[productIndex].quantity <= 0) {
        cart.splice(productIndex, 1);
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <>
      <Header />
      <Navigation />
      <div className="bg-[#F2F3F4] p-5">
        <div className="flex items-center gap-4">
          <p className="text-rose-500 font-bold">Sendo.vn </p>
          <span>/</span>
          <p>{detailproduct?.metadata?.type} </p>
          <span>/</span>
          <p>{detailproduct?.metadata?.name} </p>
        </div>
        <div className="w-[90%] m-auto">
          <div className="flex gap-5 bg-[#fff] shadow p-5 rounded-[5px]">
            <div>
              <img className="w-[500px]" src="https://media3.scdn.vn/img4/2023/05_20/E7MsFpHB44ZXCfy7iupQ_simg_b5529c_250x250_maxb.jpg" alt="" />
            </div>
            <div className="w-[70%]">
              <div className="border-b-2 border-slate-200 pb-3">
                <h1 className="text-[25px] font-bold">{detailproduct?.metadata?.name}</h1>
                <span className="text-[#2f2f2f]">{detailproduct?.metadata?.attributes?.brand}</span>
                <span className="text-[25px] font-bold block text-rose-600">{formatCurrency(detailproduct?.metadata?.price)}</span>
                <span className="text-[#0F7BFE]">Lượt đánh giá {detailproduct?.metadata?.ratingAverage}</span>
              </div>

              <div className="flex gap-5 mt-3">
                <div className="w-[200px]">
                  <span className="text-[#545454]">Chọn màu sắc: </span>
                  <span className={`block font-bold ${pickColor ? 'text-rose-500' : ''}`}>{pickColor}</span>
                </div>
                <button
                  onClick={() => handlePickColor(detailproduct?.metadata?.attributes?.color)}
                  className={`py-2 rounded-[5px] px-5 w-[90px] font-bold block ${pickColor === detailproduct?.metadata?.attributes?.color ? "border-2 border-rose-500 bg-[#fff]" : "bg-[#e7e8ea] text-[#a5a5a5]"
                    }`}
                >
                  {detailproduct?.metadata?.attributes?.color}
                </button>
              </div>
              <div className="flex gap-2 mt-5">
                <div className="w-[200px]">
                  <span>Chọn số lượng:</span>
                </div>
                <div>
                  <button
                    className="bg-[#dbdbdb] w-[30px] rounded-[4px] text-[20px]"
                    onClick={() => setQuantity(prev => {
                      const newQuantity = Math.max(prev - 1, 0);
                      updateCart(detailproduct.id, newQuantity - prev); 
                      return newQuantity;
                    })}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-[40px] no-spin pl-4 p-1 mx-2"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="bg-[#dbdbdb] w-[30px] rounded-[4px] text-[20px]"
                    onClick={() => setQuantity(prev => {
                      const newQuantity = prev + 1;
                      updateCart(detailproduct.id, newQuantity - prev);
                      return newQuantity;
                    })}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 border-b-2 border-slate-200 pb-4">
                <ButtonDefault
                  nameButton="Thêm vào giỏ hàng"
                  style="bg-[#e7e8ea] p-3 rounded-[5px] w-[200px] text-[#3F4B53] font-bold"
                  onClick={()=>addToCart()}
                />
                <ButtonDefault
                  nameButton="Mua ngay"
                  style="bg-[#EE2624] p-3 rounded-[5px] w-[200px] font-bold text-[#fff]"
                />
              </div>
              <div className="pt-[30px]">
                <Policy />
              </div>
            </div>
          </div>
          <div className="flex mt-3 gap-4">
            <div className="w-[30%] bg-[#fff] shadow p-5 rounded-[5px]">
              <h1>Thông tin nhà cung cấp</h1>
            </div>
            <div className="pt-5 shadow w-[70%] bg-[#fff] p-5 rounded-[5px]">
              <Description description={detailproduct?.metadata?.description} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detailproduct;
