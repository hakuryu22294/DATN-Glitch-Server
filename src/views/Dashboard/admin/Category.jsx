import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";
import { PropagateLoader } from "react-spinners";
import ApexCharts from "react-apexcharts";
import Pagination from "../../Pagination";
import Search from "../../components/Search";
import {
  categoryAdd,
  messageClear,
  get_category,
} from "../../../redux/store/reducers/categoryReducer";
import { get_products_count_by_category } from "../../../redux/store/reducers/dashboardReducer";

const Category = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, categories } = useSelector(
    (state) => state.category
  );
  const { statsCategory } = useSelector((state) => state.dashboard);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);
  const [imageShow, setImage] = useState("");
  const [state, setState] = useState({ name: "", image: "" });

  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: { type: "donut" },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 300 },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({ name: "", image: "" });
      setImage("");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_category(obj));
    dispatch(get_products_count_by_category());
  }, [searchValue, currentPage, parPage, dispatch]);

  useEffect(() => {
    if (statsCategory && statsCategory.length > 0) {
      const categories = statsCategory.map((item) => item.categoryName);
      const productCounts = statsCategory.map((item) => item.totalProducts);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: productCounts,
        options: { ...prevOptions.options, labels: categories },
      }));
    }
  }, [statsCategory]);

  const imageHandle = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
      setState({ ...state, image: files[0] });
    }
  };

  const add_category = (e) => {
    e.preventDefault();
    dispatch(categoryAdd(state));
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 p-4 bg-base-100 shadow-md rounded-md">
        <h1 className="font-semibold text-2xl">Category</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-blue-500 shadow-lg hover:shadow-blue-500/40 px-4 py-2 cursor-pointer rounded-sm text-sm"
        >
          Add
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Table */}
        <div className="w-full lg:w-1/2 bg-base-100 shadow-md rounded-md p-4">
          <Search
            setParPage={setParPage}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
          />
          <div className="relative overflow-x-auto">
            <table className="table w-full text-sm text-left">
              <thead className="text-sm uppercase border-b border-slate-700">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    No
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Image
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((d, i) => (
                  <tr key={i}>
                    <td
                      scope="row"
                      className="py-1 px-4 font-medium whitespace-nowrap"
                    >
                      {i + 1}
                    </td>
                    <td
                      scope="row"
                      className="py-1 px-4 font-medium whitespace-nowrap"
                    >
                      <img className="w-[45px] h-[45px]" src={d.image} alt="" />
                    </td>
                    <td
                      scope="row"
                      className="py-1 px-4 font-medium whitespace-nowrap"
                    >
                      {d.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full flex justify-end mt-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={50}
                parPage={parPage}
                showItem={3}
              />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full lg:w-1/2 bg-base-100 shadow-md rounded-md p-4">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Products by Category
          </h2>
          <ApexCharts
            options={chartOptions.options}
            series={chartOptions.series}
            type="donut"
            width="500px"
          />
        </div>
      </div>

      {/* Form Add Category */}
      <div
        className={`fixed z-[9999] top-0 right-0 transform ${
          show ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 bg-base-100 shadow-md rounded-md`}
        style={{ width: "320px" }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Add Category</h1>
            <button onClick={() => setShow(false)} className="text-xl">
              <IoMdCloseCircle />
            </button>
          </div>
          <form onSubmit={add_category}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">
                Category Name
              </label>
              <input
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                className="input input-bordered w-full"
                type="text"
                id="name"
                placeholder="Category Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block mb-2">
                Category Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={imageHandle}
                className="file-input file-input-bordered w-full"
              />
              {imageShow && (
                <img
                  src={imageShow}
                  alt="Preview"
                  className="mt-2 w-full h-auto"
                />
              )}
            </div>
            <button disabled={loader} className="btn btn-primary w-full">
              {loader ? <PropagateLoader color="#fff" /> : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Category;
