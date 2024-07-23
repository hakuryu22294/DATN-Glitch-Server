import authReducer from "./Reducers/authReducer";
import categoriesReducer from "./Reducers/categoriesReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import productReducer from "./Reducers/productReducer";

const rootReducer = {
  auth: authReducer,
  categories: categoriesReducer,
  dashboard: dashboardReducer,
  product: productReducer,
};

export default rootReducer;
