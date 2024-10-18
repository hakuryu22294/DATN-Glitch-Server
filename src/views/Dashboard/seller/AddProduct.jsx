import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdImages } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../../utils";
import toast from "react-hot-toast";
import {
  add_product,
  messageClear,
} from "../../../redux/store/reducers/productReducer";
import axios from "axios";
const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.product
  );
  const { shopInfo } = useSelector((state) => state.auth);
  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const changeImage = (img, index) => {
    if (img) {
      let tempUrl = imageShow;
      let tempImages = images;

      tempImages[index] = img;
      tempUrl[index] = { url: URL.createObjectURL(img) };
      setImageShow([...tempUrl]);
      setImages([...tempImages]);
    }
  };

  console.log(imageShow);

  const imageHandle = async (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      // Cập nhật danh sách các tệp hình ảnh
      const newImages = [...files];
      setImages((prev) => [...prev, ...newImages]);

      // Xử lý từng tệp hình ảnh
      for (let i = 0; i < length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("image", file);

        // Tạo URL tạm thời cho hình ảnh
        const imageUrl = URL.createObjectURL(file);
        setImageShow((prev) => [...prev, imageUrl]);

        try {
          const { data } = await axios.post(
            "http://localhost:8000/api/v1/product/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );
          if (data) {
            toast.success("Image uploaded.");
          }
          console.log(data);
          setImageUrls((prev) => [...prev, data.data]);
        } catch (error) {
          toast.error("Error uploading image.");
        }
      }
    }
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
      });
      setImageShow([]);
      setImages([]);
      setImageUrls([]);
      navigate("/seller/dashboard/products");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const removeImage = (i) => {
    const filterImage = images.filter((_, index) => index !== i);
    const filterImageUrl = imageShow.filter((_, index) => index !== i);

    const filterImageUrls = imageUrls.filter((_, index) => index !== i);

    setImages(filterImage);
    setImageShow(filterImageUrl);
    setImageUrls(filterImageUrls);
  };
  console.log(imageUrls);

  const add = (e) => {
    e.preventDefault();

    const productData = {
      name: state.name,
      description: state.description,
      price: state.price,
      stock: state.stock,
      discount: state.discount,
      brand: state.brand,
      shopName: "EasyShop",
      category: shopInfo.shopInfo.category,
      images: imageUrls,
    };

    dispatch(add_product(productData));
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-base-300 rounded-md shadow-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-base-content text-xl font-semibold">
            Add Product
          </h1>
          <Link
            to="/seller/dashboard/products"
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-sm px-7 py-2 my-2"
          >
            All Product
          </Link>
        </div>

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4 md:gap-4 gap-2 w-full text-base-content mb-4">
          {imageShow.map((img, i) => (
            <div key={i} className="relative w-[200px] h-[200px]">
              <label
                htmlFor={i}
                className="block h-full w-[200px] overflow-hidden rounded-sm relative"
              >
                <span
                  onClick={() => removeImage(i)}
                  className="p-2 z-10 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white absolute top-1 right-1 rounded-full"
                >
                  <IoMdCloseCircle />
                </span>
                <img
                  className="w-[200px] h-[200px] object-cover"
                  src={img}
                  alt=""
                />
              </label>
              <input
                onChange={(e) => changeImage(e.target.files[0], i)}
                type="file"
                id={i}
                className="hidden"
              />
            </div>
          ))}

          {imageShow.length < 5 && (
            <label
              className="flex justify-center items-center flex-col w-[200px] h-[200px] cursor-pointer border-blue-300 border border-dashed hover:border-red-500 text-gray-800"
              htmlFor="image"
            >
              <span>
                <IoMdImages />
              </span>
              <span>Select Image</span>
            </label>
          )}
          <input
            className="hidden"
            onChange={imageHandle}
            multiple
            type="file"
            id="image"
          />
        </div>

        {/* Form Section */}
        <div>
          <form onSubmit={add}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-base-content">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product Name</label>
                <input
                  className="px-4 py-2 focus:border-blue-500 outline-none border border-gray-300 bg-base-300 rounded-md text-base-content"
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product Name"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Product Brand</label>
                <input
                  className="px-4 py-2 focus:border-blue-500 outline-none  border border-gray-300 bg-base-300 rounded-md text-base-content"
                  onChange={inputHandle}
                  value={state.brand}
                  type="text"
                  name="brand"
                  id="brand"
                  placeholder="Brand Name"
                />
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-base-content">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  readOnly
                  className="px-4 py-2 focus:border-blue-500 outline-none  border border-gray-300 bg-base-300 rounded-md text-base-content"
                  value={shopInfo?.shopInfo?.category}
                  type="text"
                  id="category"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Product Stock</label>
                <input
                  className="px-4 py-2 focus:border-blue-500 outline-none  border border-gray-300 bg-base-300 rounded-md text-base-content"
                  onChange={inputHandle}
                  value={state.stock}
                  type="text"
                  name="stock"
                  id="stock"
                  placeholder="Stock"
                />
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-base-content">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Price</label>
                <input
                  className="px-4 py-2 focus:border-blue-500 outline-none  border border-gray-300 bg-base-300 rounded-md text-base-content"
                  onChange={inputHandle}
                  value={state.price}
                  type="number"
                  name="price"
                  id="price"
                  placeholder="price"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  className="px-4 py-2 focus:border-blue-500 outline-none  border border-gray-300 bg-base-300 rounded-md text-base-content"
                  onChange={inputHandle}
                  value={state.discount}
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="discount by %"
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-1 mb-5">
              <label htmlFor="description" className="text-base-content ">
                Description
              </label>
              <textarea
                className="px-4 py-2 focus:border-blue-500 outline-none  border border-gray-300 bg-base-300 rounded-md text-base-content"
                onChange={inputHandle}
                value={state.description}
                name="description"
                id="description"
                placeholder="Description"
                cols="10"
                rows="4"
              ></textarea>
            </div>

            <div className="flex">
              <button
                disabled={loader}
                className="bg-rose-500 w-[280px] hover:bg-rose-700 text-white rounded-md px-7 py-2 mb-3 flex items-center justify-center"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
