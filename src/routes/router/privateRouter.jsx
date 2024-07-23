import adminRoutes from "./adminRouter";
import sellerRouter from "./sellerRouter";

export const privateRouter = [...adminRoutes, ...sellerRouter];
