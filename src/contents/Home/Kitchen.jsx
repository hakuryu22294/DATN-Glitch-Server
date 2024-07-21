import Product from "../../components/ProductCard/Product";

const Kitchen = () => {
    return (
        <>
               <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, index) => (
                    <Product
                        key={index}
                        image="https://media3.scdn.vn/img4/2023/11_01/uE4l8uXbnCb2fC82WqBZ_simg_b5529c_250x250_maxb.jpg"
                        name="Chảo siêu dính"
                        price={100000}
                        quantity={2}
                        ratingAverage={1}
                    />
                ))}
            </div>
        </>
    );
};

export default Kitchen;