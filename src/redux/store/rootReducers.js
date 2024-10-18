import authReducer from "./reducers/authReducer";
import categoryReducer from "./reducers/categoryReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import productReducer from "./reducers/productReducer";
import sellerReducer from "./reducers/sellerReducer";
import orderReducer from "./reducers/orderReducer";
import homeReducer from "./reducers/homeReducer";
import cartReducer from "./reducers/cartReducer";
import paymentReducer from "./reducers/paymentReducer";
import userDashboardReducer from "./reducers/userDashboardReducer";
import shipperReducer from "./reducers/shipperReducer";
import sellerDashboardReducer from "./reducers/sellerDashboardReducer";

const rootReducer = {
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  seller: sellerReducer,
  order: orderReducer,
  dashboard: dashboardReducer,
  home: homeReducer,
  cart: cartReducer,
  payment: paymentReducer,
  userDashboard: userDashboardReducer,
  shipper: shipperReducer,
  sellerDashboard: sellerDashboardReducer,
};
export default rootReducer;
