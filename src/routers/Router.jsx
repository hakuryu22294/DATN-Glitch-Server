import PathUser from "../config/pathUser/user";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import VertifyAccount from "../pages/VertifyAccount";
const UserRouter = [
{
    path:PathUser.NotFound,
    component: NotFound
},
{
    path:PathUser.Home,
    component: Home
},
      {
        path:PathUser.VertifyAccount,
        component: VertifyAccount
    }
]
export default UserRouter
