import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    title: string;
    price: number;
    image?: string;
    category: string;
    code: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface StoreState {
    cartItems: CartItem[];
    favoriteItems: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    toggleFavorite: (product: Product) => void;
    clearCart: () => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            cartItems: [],
            favoriteItems: [],

            addToCart: (product) =>
                set((state) => {
                    const existingItem = state.cartItems.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            cartItems: state.cartItems.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { cartItems: [...state.cartItems, { ...product, quantity: 1 }] };
                }),

            removeFromCart: (productId) =>
                set((state) => ({
                    cartItems: state.cartItems.filter((item) => item.id !== productId),
                })),

            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    cartItems: state.cartItems.map((item) =>
                        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                })),

            toggleFavorite: (product) =>
                set((state) => {
                    const isFavorite = state.favoriteItems.some((item) => item.id === product.id);
                    if (isFavorite) {
                        return {
                            favoriteItems: state.favoriteItems.filter((item) => item.id !== product.id),
                        };
                    }
                    return { favoriteItems: [...state.favoriteItems, product] };
                }),

            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: 'medikalciniz-storage',
        }
    )
);

