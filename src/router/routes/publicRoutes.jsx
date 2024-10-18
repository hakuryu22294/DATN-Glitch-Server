import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Shops from "../../pages/Shops";
import Cart from "../../pages/Cart";
import Shipping from "../../pages/Shipping";
import Payment from "../../pages/Payment";
import CategoryShop from "../../pages/CategoryShop";
import SearchProducts from "../../pages/SearchProducts";
import Details from "../../pages/Details";
import ConfirmOrder from "../../pages/ConfirmOrder";
import Orders from "../../pages/Orders";
import Wishlist from "../../pages/Wishlist";
import OrderDetails from "../../pages/OrderDetails";
import Dashboard from "../../pages/Dashboard";
import ReturnPayment from "../../pages/ReturnPayment";
import Index from "../../pages/Index";
import Register from "../../pages/Register";
import RegisterShop from "../../pages/RegisterShop";
import IndexHome from "../../pages/IndexHome";
import ShopPage from "../../pages/ShopPage";
import AdminLogin from "../../views/Dashboard/auth/AdminLogin";
import ForbiddenError from "../../pages/ForbiddenError";
import NotFoundPage from "../../pages/NotFoundPage";
import VerifyEmail from "../../pages/VerifyEmail";
import ShipperLogin from "../../pages/ShipperLogin";
import CODPayment from "../../pages/CodPayment";

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <IndexHome />,
      },
      {
        path: "/shopping",
        element: <Shops />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/shipping",
        element: <Shipping />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/products?",
        element: <CategoryShop />,
      },
      {
        path: "/products/search?",
        element: <SearchProducts />,
      },
      {
        path: "product/details/:slug",
        element: <Details />,
      },
      {
        path: "shop/:sellerId",
        element: <ShopPage />,
      },
      {
        path: "/order/confirm?",
        element: <ConfirmOrder />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <Index />,
          },
          {
            path: "my-orders",
            element: <Orders />,
          },
          {
            path: "my-wishlist",
            element: <Wishlist />,
          },
          {
            path: "order/details/:orderId",
            element: <OrderDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller/register",
    element: <RegisterShop />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/return_VNP/:orderId",
    element: <ReturnPayment />,
  },
  {
    path: "/return_COD/:orderId",
    element: <CODPayment />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/shipper/login",
    element: <ShipperLogin />,
  },
  {
    path: "/forbbiden",
    element: <ForbiddenError />,
  },
  {
    path: "/verify-otp/shipper/:token?",
    element: <VerifyEmail />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default publicRoutes;
