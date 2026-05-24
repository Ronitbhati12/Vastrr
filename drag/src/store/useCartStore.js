import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
  
  addToCart: (product, quantity = 1) => {
    const { cartItems } = get();
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    let updatedCartItems;
    if (existingItem) {
      updatedCartItems = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCartItems = [...cartItems, { product, quantity }];
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({ cartItems: updatedCartItems });
  },

  removeFromCart: (productId) => {
    const { cartItems } = get();
    const updatedCartItems = cartItems.filter((item) => item.product.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({ cartItems: updatedCartItems });
  },

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [] });
  },

  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
}));

export default useCartStore;
