import ShipperDashboard from "../../views/Dashboard/shipper/ShipperDashboard";
import Orders from "../../views/Dashboard/shipper/Orders";
import OrderDetails from "../../views/Dashboard/shipper/OrderDetails";
import CancelledOrders from "../../views/Dashboard/shipper/CancelledOrders";

export const shipperRoutes = [
  {
    path: "/shipper/dashboard",
    element: <ShipperDashboard />,
    role: "shipper",
    status: "active",
  },
  {
    path: "/shipper/dashboard/orders",
    element: <Orders />,
    role: "shipper",
    status: "active",
  },
  {
    path: "/shipper/dashboard/orders/:orderId/details",
    element: <OrderDetails />,
    role: "shipper",
    status: "active",
  },
  {
    path: "/shipper/dashboard/orders/cancelled",
    element: <CancelledOrders />,
    role: "shipper",
    status: "active",
  },
];
