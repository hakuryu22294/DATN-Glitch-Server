import { useRoutes } from "react-router-dom";

const RouterRoot = ({ allRoutes }) => {
  const routes = useRoutes([...allRoutes]);
  return routes;
};

export default RouterRoot;
