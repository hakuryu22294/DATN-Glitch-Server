import MainLayout from "../../layout/MainLayout";
import { privateRouter } from "./privateRouter";
import ProtectRouter from "./ProtectRouter";

export const getRoutes = () => {
  privateRouter.map((r) => {
    r.element = <ProtectRouter route={r}>{r.element}</ProtectRouter>;
  });
  return {
    path: "/",
    element: <MainLayout />,
    children: privateRouter,
  };
};
