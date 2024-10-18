import { AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUserTimes, FaUsers, FaShippingFast } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdViewList } from "react-icons/md";
import { TbBasketDiscount } from "react-icons/tb";
import { BsCartCheck } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdSpaceDashboard } from "react-icons/md";

export const allNav = [
  {
    id: 1,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Orders",
    icon: <AiOutlineShoppingCart />,
    role: "admin",
    path: "/admin/dashboard/orders",
  },
  {
    id: 3,
    title: "Category",
    icon: <BiCategory />,
    role: "admin",
    path: "/admin/dashboard/category",
  },
  {
    id: 5,
    title: "Create Shipper",
    icon: <FaShippingFast />,
    role: "admin",
    path: "/admin/dashboard/create-shipper",
  },
  {
    id: 4,
    title: "Sellers",
    icon: <FaUsers />,
    role: "admin",
    path: "/admin/dashboard/sellers",
  },
  {
    id: 6,
    title: "Seller Requests",
    icon: <FaUserTimes />,
    role: "admin",
    path: "/admin/dashboard/deactive-sellers",
  },
  {
    id: 9,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "seller",
    path: "/seller/dashboard",
  },
  {
    id: 10,
    title: "Add Product",
    icon: <IoMdAdd />,
    role: "seller",
    path: "/seller/dashboard/add-product",
  },
  {
    id: 11,
    title: "All Product",
    icon: <MdViewList />,
    role: "seller",
    path: "/seller/dashboard/products",
  },

  {
    id: 13,
    title: "Orders",
    icon: <BsCartCheck />,
    role: "seller",
    path: "/seller/dashboard/orders",
  },

  {
    id: 17,
    title: "Profile",
    icon: <CgProfile />,
    role: "seller",
    path: "/seller/dashboard/profile",
  },
  {
    id: 18,
    title: "Dashboard",
    icon: <MdSpaceDashboard />,
    role: "shipper",
    path: "/shipper/dashboard",
  },
  {
    id: 19,
    title: "Orders",
    icon: <MdViewList />,
    role: "shipper",
    path: "/shipper/dashboard/orders",
  },
  {
    id: 20,
    title: "Cancelled Orders",
    icon: <MdViewList />,
    role: "shipper",
    path: "/shipper/dashboard/orders/cancelled",
  },
  {
    id: 21,
    title: "Profile",
    icon: <CgProfile />,
    role: "shipper",
    path: "/shipper/dashboard/profile",
  },
];
