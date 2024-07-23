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
        const updatedCart = cart.map(item =>
            item.metadata._id === id ? { ...item, quantity: Math.max(item.quantity + delta, 0) } : item
        ).filter(item => item.quantity > 0);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    
 const deleteProductCart = (id)=>{


    const deleteCart  = cart.filter(productCart => productCart.metadata._id !== id)
    setCart(deleteCart)
    localStorage.setItem('cart',JSON.stringify(deleteCart))
 }

    const carts = {
        cart, 
        addToCart,
        updateCart,
        deleteProductCart
    }

    return (
        <CartContext.Provider value={carts}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
