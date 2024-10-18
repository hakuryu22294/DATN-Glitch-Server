import SellerDashboard from "../../views/Dashboard/seller/SellerDashboard";
import AddProduct from "../../views/Dashboard/seller/AddProduct";
import Products from "../../views/Dashboard/seller/Products";
import EditProduct from "../../views/Dashboard/seller/EditProduct";
import DiscountProducts from "../../views/Dashboard/seller/DiscountProducts";
import Orders from "../../views/Dashboard/seller/Orders";
import OrderDetails from "../../views/Dashboard/seller/OrderDetails";
import Payments from "../../views/Dashboard/seller/Payments";

import Profile from "../../views/Dashboard/seller/Profile";
import Deactive from "../../views/Deactive";
import Pending from "../../views/Pending";

export const sellerRoutes = [
  {
    path: "/seller/account-pending",
    element: <Pending />,
    ability: "seller",
  },
  {
    path: "/seller/account-deactive",
    element: <Deactive />,
    ability: "seller",
  },
  {
    path: "/seller/dashboard",
    element: <SellerDashboard />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/add-product",
    element: <AddProduct />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/edit-product/:productId",
    element: <EditProduct />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/products",
    element: <Products />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/discount-product",
    element: <DiscountProducts />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/orders",
    element: <Orders />,
    role: "seller",
    visibility: ["active", "deactive"],
  },
  {
    path: "/seller/dashboard/order/details/:orderId",
    element: <OrderDetails />,
    role: "seller",
    visibility: ["active", "deactive"],
  },
  {
    path: "/seller/dashboard/payments",
    element: <Payments />,
    role: "seller",
    status: "active",
  },

  {
    path: "/seller/dashboard/profile",
    element: <Profile />,
    role: "seller",
    visibility: ["active", "deactive", "pending"],
  },
];
