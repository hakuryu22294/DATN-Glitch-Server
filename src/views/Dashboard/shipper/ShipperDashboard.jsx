import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { get_shipper_dashboard } from "../../../redux/store/reducers/shipperReducer";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const ShipperDashboard = () => {
  const dispatch = useDispatch();
  const {
    shipperInfo,
    ordersAssignedCount,
    totalIncome,
    ordersDeliveredCount,
    ordersCanceledCount,
  } = useSelector((state) => state.shipper);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = selectedDate
    ? moment(selectedDate).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  useEffect(() => {
    if (shipperInfo?.id) {
      dispatch(
        get_shipper_dashboard({
          shipperId: shipperInfo.id,
          date: formattedDate,
        })
      );
    }
  }, [dispatch, shipperInfo, formattedDate]);

  const chartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    colors: ["#1E90FF"],
  };

  const chartSeries = [
    {
      name: "Thu nhập",
      data: [150, 200, 170, 220, 300, 250, 270],
    },
  ];

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Chọn ngày</h3>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h3 className="text-lg font-bold">Thu nhập</h3>
            <p className="text-3xl">{totalIncome?.toLocaleString()} VND</p>
          </div>
        </div>
        <div className="card bg-secondary text-primary-content">
          <div className="card-body">
            <h3 className="text-lg font-bold">Đơn hàng đã nhận</h3>
            <p className="text-3xl">{ordersAssignedCount}</p>
          </div>
        </div>
        <div className="card bg-accent text-error-content">
          <div className="card-body">
            <h3 className="text-lg font-bold">Giao Thành Công</h3>
            <p className="text-3xl">{ordersDeliveredCount}</p>
          </div>
        </div>
        <div className="card bg-error text-accent-content">
          <div className="card-body">
            <h3 className="text-lg font-bold">Đã Hủy</h3>
            <p className="text-3xl">{ordersCanceledCount}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Thu nhập hàng tuần</h3>
        <div className="bg-base-100 p-4 rounded-lg shadow">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Active Orders</h3>
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* <tbody>
              {ordersAssigned.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customerId.name}</td>
                  <td>{order.shippingInfo.address}</td>
                  <td
                    className={`text-${
                      order.deliveryStatus === "Delivered" ? "green" : "yellow"
                    }-500`}
                  >
                    {order.deliveryStatus}
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboard;
