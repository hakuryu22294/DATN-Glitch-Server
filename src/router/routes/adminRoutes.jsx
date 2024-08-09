import AdminDashboard from "../../views/Dashboard/admin/AdminDashboard";
import Orders from "../../views/Dashboard/admin/Orders";
import Category from "../../views/Dashboard/admin/Category";
import Sellers from "../../views/Dashboard/admin/Sellers";
import PaymentRequest from "../../views/Dashboard/admin/PaymentRequest";
import DeactiveSellers from "../../views/Dashboard/admin/DeactiveSellers";
import SellerRequest from "../../views/Dashboard/admin/SellerRequest";
import SellerDetails from "../../views/Dashboard/admin/SellerDetails";
import ChatSeller from "../../views/Dashboard/admin/ChatSeller";
import OrderDetails from "../../views/Dashboard/admin/OrderDetails";
import CreateShipper from "../../views/Dashboard/admin/CreateShipper";
export const adminRoutes = [
  {
    path: "admin/dashboard",
    element: <AdminDashboard />,
    role: "admin",
  },
  {
    path: "admin/dashboard/orders",
    element: <Orders />,
    role: "admin",
  },
  {
    path: "admin/dashboard/category",
    element: <Category />,
    role: "admin",
  },
  {
    path: "admin/dashboard/create-shipper",
    element: <CreateShipper />,
    role: "admin",
  },
  {
    path: "admin/dashboard/sellers",
    element: <Sellers />,
    role: "admin",
  },
  {
    path: "admin/dashboard/payment-request",
    element: <PaymentRequest />,
    role: "admin",
  },
  {
    path: "admin/dashboard/deactive-sellers",
    element: <DeactiveSellers />,
    role: "admin",
  },
  {
    path: "admin/dashboard/sellers-request",
    element: <SellerRequest />,
    role: "admin",
  },
  {
    path: "admin/dashboard/seller/details/:sellerId",
    element: <SellerDetails />,
    role: "admin",
  },
  {
    path: "admin/dashboard/chat-sellers",
    element: <ChatSeller />,
    role: "admin",
  },
  {
    path: "admin/dashboard/chat-sellers/:sellerId",
    element: <ChatSeller />,
    role: "admin",
  },
  {
    path: "admin/dashboard/order/details/:orderId",
    element: <OrderDetails />,
    role: "admin",
  },
];
