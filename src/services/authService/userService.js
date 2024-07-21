import { http } from "../../utils/http";
import { showToastSuccess , showToastError} from "../../config/toastConfig";

const UserService = {
    RegisterAccount: async (dataRegister) => {
        try {
            const { data } = await http.post('/access/shop/sign-up', dataRegister)
            if(!data) return
            showToastSuccess(`${data.message} Vui lòng kiểm tra mail để xác thực tài khoản`)
            return data
        } catch (error) {
            showToastError(error.response.data.message);
        }
    },
    LoginAccount: async (dataLogin) => {
        try {
            const {data} = await http.post(`access/shop/sign-in`, dataLogin);
            if(!data) return
            showToastSuccess(data.message)
            return data;
        } catch (error) {
            showToastError(error.response.data.message);
        }
    },
    GetUserData: async (token) => {
        try {
            const response = await http.get(`users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error retrieving user data:", error);
            throw new Error("Đã xảy ra lỗi khi lấy dữ liệu người dùng");
        }
    },
}
export default UserService