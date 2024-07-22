import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../services/productService/productService";
import Header from "../layouts/Header";
import Navigation from "../layouts/Navigation";
const Detailproduct = () => {
  const { id } = useParams()
  const [detailproduct, setDetailproduct] = useState([])
  useEffect(() => {
    const getDataDetailProduct = async () => {
      const dataProduct = await ProductService.GetDetailProduct(String(id))
      setDetailproduct(dataProduct)
    }
    getDataDetailProduct()
  }, [])
  console.log(detailproduct);
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
      </div>
    </>
  );
};

export default Detailproduct;