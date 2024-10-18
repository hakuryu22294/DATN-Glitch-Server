import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  update_product,
  messageClear,
  update_sub_cate,
  get_products_by_shop,
} from "../../../redux/store/reducers/productReducer";
import { formatCurrency } from "../../../utils";
import toast from "react-hot-toast";
import { get_shop_info } from "../../../redux/store/reducers/authReducer";
import Pagination from "../../Pagination";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce"; // Import lodash debounce
import { add_sub_category } from "../../../redux/store/reducers/sellerReducer"; // Import thunk

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct, successMessage } = useSelector(
    (state) => state.product
  );
  console.log(products);
  const { shopInfo } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(8);
  const [editProductId, setEditProductId] = useState(null);
  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [subCategories, setSubCategories] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      dispatch(
        get_products_by_shop({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
          subCategory: selectedSubCategory || undefined,
          status: selectedStatus || undefined,
          sellerId: shopInfo._id,
        })
      );
    }, 500),
    [dispatch, parPage, currentPage, selectedSubCategory, selectedStatus]
  );

  useEffect(() => {
    dispatch(get_shop_info());

    if (shopInfo) {
      dispatch(
        get_products_by_shop({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
          subCategory: selectedSubCategory || undefined,
          status: selectedStatus || undefined,
          sellerId: shopInfo._id,
        })
      );
    }
  }, [searchValue, debouncedSearch, dispatch, shopInfo._id]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);

  const handleSaveChanges = (productId, field) => {
    const updatedField = { [field]: fieldValue };
    dispatch(update_product({ productId, fieldsToUpdate: updatedField }));
    setEditProductId(null);
    setEditField(null);
    setFieldValue("");
  };

  const handleUpdateSubCategory = (subCategory) => {
    dispatch(update_sub_cate({ productsIds: selectedProducts, subCategory }));
    setSelectedProducts([]);
    setSelectedSubCategory("");
  };

  const handlePublish = (productId, currentStatus) => {
    const updatedStatus =
      currentStatus === "published" ? "unpublished" : "published";
    dispatch(
      update_product({ productId, fieldsToUpdate: { status: updatedStatus } })
    );
  };

  const handleAddSubCategory = () => {
    // Example sellerId, replace with actual value
    if (newSubCategory) {
      dispatch(
        add_sub_category({
          sellerId: shopInfo._id,
          subCategory: newSubCategory,
        })
      )
        .unwrap()
        .then((data) => {
          setSubCategories((prev) => [...prev, data]);
          setNewSubCategory("");
          toast.success("Danh mục đã được thêm thành công!");
          dispatch(get_shop_info());
        })
        .catch((error) => {
          toast.error(`${error}`);
        });
    }
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
    dispatch(
      get_products_by_shop({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
        subCategory,
        status: selectedStatus || undefined,
        sellerId: shopInfo._id,
      })
    );
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (shopInfo) {
      dispatch(
        get_products_by_shop({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
          subCategory: selectedSubCategory || undefined,
          status,
          sellerId: shopInfo._id,
        })
      );
    }
  };
  return (
    <div className="px-4 lg:px-8">
      <h1 className="font-semibold text-2xl mb-4">Quản lý sản phẩm</h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section: Filters */}
        <div className="lg:col-span-1 bg-base-300 p-5 rounded-md shadow-md">
          {/* SubCategory Filter */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-4">Lọc theo danh mục</h2>
            {shopInfo?.subCategories?.map((cat, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="subCategory"
                  checked={selectedSubCategory === cat}
                  value={cat}
                  onChange={() => handleSubCategoryChange(cat)}
                  className="mr-2"
                />
                <label htmlFor={i} className="cursor-pointer">
                  {cat}
                </label>
              </div>
            ))}
            <button
              className="w-full mt-2 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 transition"
              onClick={() => setSelectedSubCategory("")}
            >
              Reset Filter
            </button>
          </div>
          <div className="mb-6">
            <h3 className="mb-2 text-xl font-bold">Lọc theo trạng thái</h3>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                name="status"
                value="published"
                checked={selectedStatus === "published"}
                onChange={() => handleStatusChange("published")}
                className="mr-2"
              />
              <label className="cursor-pointer">Published</label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                name="status"
                value="unpublished"
                checked={selectedStatus === "unpublished"}
                onChange={() => handleStatusChange("unpublished")}
                className="mr-2"
              />
              <label className="cursor-pointer">Unpublished</label>
            </div>
            <button
              className="w-full mt-2 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 transition"
              onClick={() => setSelectedStatus("")}
            >
              Reset Filter
            </button>
          </div>

          {/* Add SubCategory Button */}
          {shopInfo?.subCategories?.length < 5 && (
            <div className="mb-6">
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder="New SubCategory"
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              />
              <button
                className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                onClick={handleAddSubCategory}
              >
                Thêm danh mục hàng
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Search and Products */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="flex items-center mb-6">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="w-full p-5 bg-base-300 rounded-md shadow-md">
            {/* Grid Layout for products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {products.length > 0 ? (
                products?.map((d) => (
                  <div
                    key={d._id}
                    className="bg-base-200 text-base-content flex flex-col gap-2 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Checkbox for selecting the product */}
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(d._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts((prev) => [...prev, d._id]);
                          } else {
                            setSelectedProducts((prev) =>
                              prev.filter((productId) => productId !== d._id)
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      <label
                        htmlFor={d._id}
                        className="cursor-pointer font-semibold"
                      >
                        Chọn sản phẩm
                      </label>
                    </div>

                    <img
                      className="w-full h-48 object-cover rounded-md"
                      src={d.images[0]}
                      alt={d.name}
                    />

                    {/* Product Name */}
                    <div>
                      {editProductId === d._id && editField === "name" ? (
                        <>
                          <input
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                          />
                          <button
                            className="bg-green-500 text-white p-2 rounded mt-2"
                            onClick={() => handleSaveChanges(d._id, "name")}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <h2
                          className="mt-3 font-semibold text-lg"
                          title={d?.name}
                        >
                          {d?.name?.length > 20
                            ? `${d?.name?.slice(0, 20)}...`
                            : d?.name}
                          <span
                            className="ml-2 text-primary font-bold underline cursor-pointer"
                            onClick={() => {
                              setEditProductId(d._id);
                              setEditField("name");
                              setFieldValue(d.name);
                            }}
                          >
                            Chỉnh sửa
                          </span>
                        </h2>
                      )}
                    </div>

                    {/* Product Price */}
                    <div className="flex gap-2 align-items-center">
                      {editProductId === d._id && editField === "price" ? (
                        <>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                          />
                          <button
                            className="bg-green-500 text-white p-2 rounded mt-2"
                            onClick={() => handleSaveChanges(d._id, "price")}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">
                            {formatCurrency(d.price)}
                          </p>
                          <span
                            className="text-primary font-bold underline cursor-pointer"
                            onClick={() => {
                              setEditProductId(d._id);
                              setEditField("price");
                              setFieldValue(d.price);
                            }}
                          >
                            Chỉnh sửa
                          </span>
                        </>
                      )}
                    </div>

                    {/* Discount Section */}
                    <div className="flex gap-2 align-items-center">
                      {editProductId === d._id && editField === "discount" ? (
                        <>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                          />
                          <button
                            className="bg-green-500 text-white p-2 rounded mt-2"
                            onClick={() => handleSaveChanges(d._id, "discount")}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">
                            Giảm giá: {d.discount || 0}%
                          </p>
                          <span
                            className="text-primary font-bold underline cursor-pointer"
                            onClick={() => {
                              setEditProductId(d._id);
                              setEditField("discount");
                              setFieldValue(d.discount || 0);
                            }}
                          >
                            Chỉnh sửa
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 align-items-center">
                      {editProductId === d._id && editField === "stock" ? (
                        <>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                          />
                          <button
                            className="bg-green-500 text-white p-2 rounded mt-2"
                            onClick={() => handleSaveChanges(d._id, "stock")}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">Kho: {d.stock || 0}</p>
                          <span
                            className="text-primary font-bold underline cursor-pointer"
                            onClick={() => {
                              setEditProductId(d._id);
                              setEditField("stock");
                              setFieldValue(d.discount || 0);
                            }}
                          >
                            Chỉnh sửa
                          </span>
                        </>
                      )}
                    </div>
                    <p
                      className={`font-semibold ${
                        d.subCategory ? "text-accent" : "text-warning"
                      }`}
                    >
                      {d.subCategory ? d.subCategory : "Chưa phân loại"}
                    </p>
                    {/* Publish/Unpublish Button */}
                    <button
                      onClick={() => handlePublish(d._id, d.status)}
                      className={`w-full mt-4 p-2 rounded ${
                        d.status === "published"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {d.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center font-bold text-lg text-red-500">
                  Không có sản phẩm nào
                </p>
              )}
            </div>
            {selectedProducts.length > 0 && (
              <div className="flex justify-end mt-4">
                <div className="mb-6">
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  >
                    <option value="">Chọn danh mục con</option>
                    {shopInfo?.subCategories?.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <button
                    className="w-full bg-primary text-white p-2 rounded mt-4 hover:bg-blue-600 transition"
                    onClick={() => handleUpdateSubCategory(selectedSubCategory)}
                  >
                    Cập nhật danh mục con
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={totalProduct}
                parPage={parPage}
                showItem={5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
