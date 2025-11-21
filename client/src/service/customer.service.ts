import axiosConfig from "../config/AxiosConfig";
import type { cartValidationProps } from "../module/Cusomter/customer.validator";

class CustomerService {
    addToCart = async (data: cartValidationProps, productId: string) => {
        await axiosConfig.post(`/cart/items`, data, {
            params: {
                id: productId
            }
        })
    } 

    listCart = async() => {
        let response = await axiosConfig.get('/cart/list');
        return response
    }

    getSingleCartById = async(id: string) => {
        let response = await axiosConfig.get(`/cart/items/${id}`)
        return response
    }

    updateCartById = async(id: string, data: cartValidationProps) => {
        await axiosConfig.put(`/cart/items/${id}`, data)
    }
}

const customerSvc = new CustomerService();

export default customerSvc;