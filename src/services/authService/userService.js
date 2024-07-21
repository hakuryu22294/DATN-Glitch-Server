import { http } from "../../utils/http";
import { showToastSuccess , showToastError} from "../../config/toastConfig";

const UserService = {
    RegisterAccount: async (dataRegister) => {
        try {
            const { data } = await http.post('/access/shop/sign-up', dataRegister)
            if(!data) return
            showToastSuccess(data.message)
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
   
 
}
export default UserService
