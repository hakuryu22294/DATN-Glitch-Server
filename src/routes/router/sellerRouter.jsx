import { lazy } from "react";
import Pending from "../../views/Pending";
import Deactive from "../../views/Deactive";
import AddProduct from "../../views/seller/AddProduct";
import Products from "../../views/seller/Products";
const SellerDashboard = lazy(() =>
  import("../../views/seller/SellerDashboard")
);
const sellerRouter = [
  {
    path: "seller/account-deactive",
    element: <Deactive />,
    ability: "seller",
  },
  {
    path: "seller/dashboard",
    element: <SellerDashboard />,
    role: "seller",
    status: "active",
  },
  {
    path: "seller/account-pending",
    element: <Pending />,
    ability: "seller",
  },

  {
    path: "seller/dashboard/add-product",
    element: <AddProduct />,
    role: "seller",
    status: "active",
  },
  {
    path: "seller/dashboard/products",
    element: <Products />,
    role: "seller",
    status: "active",
  },
];
export default sellerRouter;
