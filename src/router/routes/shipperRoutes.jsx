import ShipperDashboard from "../../views/Dashboard/shipper/ShipperDashboard";
import Orders from "../../views/Dashboard/shipper/Orders";

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
];
