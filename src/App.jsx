import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import publicRouter from "./routes/router/publicRouter";
import { get_user_info } from "./redux/store/Reducers/authReducer";
import { getRoutes } from "./routes/router";
import Router from "./routes/RouterRoot";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [allRoutes, setAllRoutes] = useState([...publicRouter]);
  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes([...allRoutes, routes]);
  }, []);
  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [dispatch, token]);
  return <Router allRoutes={allRoutes}></Router>;
}

export default App;
