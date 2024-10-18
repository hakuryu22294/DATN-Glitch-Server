import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./redux/store/reducers/authReducer";
import { getRoutes } from "./router/routes/index";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);
  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [dispatch, token]);
  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes([...allRoutes, routes]);
  }, []);

  return <Router allRoutes={allRoutes}></Router>;
}

export default App;
