/* eslint-disable react/prop-types */
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  get_shop_info,
  get_user_info,
} from "../../redux/store/reducers/authReducer";

const ProtectRoute = ({ route, children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_user_info());
    dispatch(get_shop_info());
  }, [dispatch]);
  const { userInfo, shopInfo } = useSelector((state) => state.auth);
  if (userInfo) {
    if (route.role) {
      if (userInfo.role === route.role) {
        if (route.status) {
          if (route.status === shopInfo.status) {
            return <Suspense fallback={null}>{children}</Suspense>;
          } else {
            if (shopInfo.status === "pending") {
              return <Navigate to="/seller/account-pending" replace />;
            } else {
              return <Navigate to="/seller/account-deactive" replace />;
            }
          }
        } else {
          if (route.visibility) {
            console.log(route.visibility, shopInfo.status);
            if (route.visibility.some((r) => r === shopInfo.status)) {
              return <Suspense fallback={null}>{children}</Suspense>;
            } else {
              return <Navigate to="/seller/account-pending" replace />;
            }
          } else {
            return <Suspense fallback={null}>{children}</Suspense>;
          }
        }
      } else {
        return <Navigate to="/forbbiden" replace />;
      }
    } else {
      if (route.ability === "seller") {
        return <Suspense fallback={null}>{children}</Suspense>;
      }
    }
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectRoute;
