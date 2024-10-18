/* eslint-disable react/prop-types */
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { get_shop_info } from "../../redux/store/reducers/authReducer";

const ProtectRoute = ({ route, children }) => {
  const { userInfo, shopInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo && userInfo?.role === "seller") dispatch(get_shop_info());
  }, [dispatch, userInfo]);
  console.log(userInfo);

  if (userInfo) {
    if (route?.role) {
      if (userInfo?.role === route?.role) {
        if (route?.status) {
          if (shopInfo) {
            if (route.status === shopInfo?.status) {
              return <Suspense fallback={null}>{children}</Suspense>;
            } else {
              console.log(shopInfo?.status);
              if (shopInfo?.status === "pending") {
                return <Navigate to="/seller/account-pending" replace />;
              } else {
                return <Navigate to="/seller/account-deactive" replace />;
              }
            }
          } else {
            return <Suspense fallback={null}>{children}</Suspense>;
          }
        } else if (route.role === "admin") {
          return <Suspense fallback={null}>{children}</Suspense>;
        } else {
          if (shopInfo) {
            if (route?.visibility) {
              if (route.visibility.some((r) => r === shopInfo?.status)) {
                return <Suspense fallback={null}>{children}</Suspense>;
              } else {
                return <Navigate to="/seller/account-pending" replace />;
              }
            } else {
              return <Suspense fallback={null}>{children}</Suspense>;
            }
          }
        }
      } else {
        return <Navigate to="/forbbiden" replace />;
      }
    } else {
      if (route?.ability === "seller") {
        return <Suspense fallback={null}>{children}</Suspense>;
      }
    }
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectRoute;
