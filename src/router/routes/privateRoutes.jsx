import { adminRoutes } from "./adminRoutes";
import { sellerRoutes } from "./sellerRoutes";
import { shipperRoutes } from "./shipperRoutes";

export const privateRoutes = [
  ...adminRoutes,
  ...sellerRoutes,
  ...shipperRoutes,
];
