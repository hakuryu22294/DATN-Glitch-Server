import { lazy } from "react";
import AdminLogin from "../../views/auth/AdminLogin";
import Category from "../../views/admin/Category";
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));

const adminRoutes = [
  {
    path: "admin/dashboard",
    element: <AdminDashboard />,
    role: "admin",
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
    role: "admin",
  },
  {
    path: "/admin/dashboard/category",
    element: <Category />,
    role: "admin",
  },
];

export default adminRoutes;
