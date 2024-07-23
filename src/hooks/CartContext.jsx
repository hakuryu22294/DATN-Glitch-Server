import { createContext, useState } from 'react';
import { showToastSuccess } from '../config/toastConfig';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    const addToCart = (product) => {
        const existingProductIndex = cart.findIndex(item => item.metadata._id === product.metadata._id);

        let updatedCart;
        if (existingProductIndex >= 0) {
            updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += product.quantity;
        } else {
            updatedCart = [...cart, product];
        }

        setCart(updatedCart);  
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        showToastSuccess("Đã thêm sản phẩm vào giỏ hàng")
    };

    const updateCart = (id, delta) => {
        let updatedCart = [...cart];  
        const productIndex = updatedCart.findIndex(item => item.metadata._id === id);

        if (productIndex >= 0) {
            updatedCart[productIndex].quantity += delta;
            if (updatedCart[productIndex].quantity <= 0) {
                updatedCart.splice(productIndex, 1);
            }
        }

        setCart(updatedCart);  
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const carts = {
        cart, 
        addToCart,
        updateCart
    }

    return (
        <CartContext.Provider value={carts}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
