import { lazy } from "react";
import Register from "../../views/auth/Register";
import UnAuthoriazed from "../../views/UnAuthoriazed";
import AdminLogin from "../../views/auth/AdminLogin";
const Home = lazy(() => import("../../views/Home"));
const SellerLogin = lazy(() => import("../../views/auth/SellerLogin"));
const publicRouter = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <SellerLogin />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/unauthorized",
    element: <UnAuthoriazed />,
  },
];

export default publicRouter;
