import PathUser from "../config/pathUser/user";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import VertifyAccount from "../pages/VertifyAccount";
import Detailproduct from "../contents/Home/Detailproduct";
import Cart from "../pages/Cart";
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
    },
        {
        path:PathUser.DetailProduct,
        component: Detailproduct,
    },
        {
        path: PathUser.Cart,
        component: Cart,
    }
    
]
export default UserRouter
