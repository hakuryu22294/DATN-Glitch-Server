import Product from "../../components/ProductCard/Product";
const AllProduct = () => {
    return (
        <>
            <div className="grid grid-cols-5 gap-2 ">
                {Array.from({ length: 10 }, (_, index) => (
                    <Product
                        key={index}
                        image="https://media3.scdn.vn/img4/2023/05_20/E7MsFpHB44ZXCfy7iupQ_simg_b5529c_250x250_maxb.jpg"
                        name="Áo Khoác Dù Khóa Kéo Zip 2 Lớp Chữ DUM BLE , Phối Màu , Sọc Tay - Áo Gió Nam Nữ Cặp Đôi Couple Thu Đông - 667_114160781"
                        price={100000}
                        quantity={2}
                        ratingAverage={1}
                    />
                ))}
            </div>
        </>
    );
};

export default AllProduct;