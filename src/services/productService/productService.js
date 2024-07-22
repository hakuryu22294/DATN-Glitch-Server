import { http } from "../../utils/http";


const ProductService = {
    GetAllProduct: async () => {
        try {
            const { data } = await http.get('/products')
            return data
        } catch (error) {
            console.log(error.response.data.message);
        }
    },
}
export default ProductService;
