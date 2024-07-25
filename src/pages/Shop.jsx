import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Navigation from "../layouts/Navigation";
import Footer from "../layouts/Footer";
import Product from "../components/ProductCard/Product";
import ProductService from "../services/productService";
import { useParams } from "react-router-dom";
const Shop = () => {
    const [allProduct,setAllProduct] = useState([])
    const [productShop,setProductShop] = useState([])
    const {id} = useParams()
    useEffect(() => {
        const getDataProduct = async () => {
            const dataProduct = await ProductService.GetAllProduct();
            setAllProduct(dataProduct)
        };
        getDataProduct();
    }, [id]);
    useEffect(()=>{
        const productOrShop = allProduct.filter(productShop => productShop.sellerId === Number(id))
        setProductShop(productOrShop);
    },[allProduct,id])

    return (
        <>
            <div className="bg-[#F2F3F4]">
                <Header />
                <Navigation />
                <div className="w-[80%] m-auto pt-3">
                    <div>
                        <img className="w-full" src="https://media3.scdn.vn/img4/2024/06_28/1CjB5nPUah11jqu4wI7u.jpg" alt="" />
                        <div className="bg-[#fff] shadow ">
                            <div className="flex py-3 px-5">
                                <div className="flex gap-2">
                                    <img className="w-[50px] rounded-[50px]" src="https://media3.scdn.vn/img4/2024/01_02/gDaM9Aer2aGroLlJox0C.jpg" alt="" />
                                    <div className="flex gap-2 items-center">
                                        <h1>Mẹ và Bé QN</h1>
                                        <img className="w-[50px] h-[15px]" src="https://media3.scdn.vn/img4/2022/08_30/kBuLMejE9aDW1hGDuTFu.png" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className=" text-rose-600 cursor-pointer block py-3 hover:bg-[#e5e5e5] duration-300 px-3 border-b-2 border-rose-600">Tất Cả Sản Phẩm </span>
                            </div>
                        </div>
                        <div className="bg-[#fff] shadow">
                            <div className="grid grid-cols-3 gap-4 p-5">
                                {productShop.map((product) => (
                                    <div key={product.id}>
                                       <Link to={`/detail/${product.id}`}  key={product.id}>
                                        <Product
                                            image={product.image[0]}
                                            name={product.name}
                                            price={product.price}
                                            quantity={product.stock}
                                            shopName={product.shopName}
                                        />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Shop;
