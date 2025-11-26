import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: number;
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
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
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
export const mockProducts: Product[] = [
    { id: 1, category: "Koruyucu Ekipman", title: "Eldiven Lateks M", code: "GLV-LAT-M", price: 45.50 },
    { id: 2, category: "Sarf Malzeme", title: "Cerrahi Maske 3 Katlı", code: "MSK-SUR-3", price: 12.90 },
    { id: 3, category: "Medikal Cihaz", title: "Dijital Ateş Ölçer", code: "DEV-THR-D", price: 125.00 },
    { id: 4, category: "Koruyucu Ekipman", title: "Yüz Siperliği", code: "PRT-FSH-1", price: 35.00 },
    { id: 5, category: "Sarf Malzeme", title: "Antiseptik Solüsyon 1L", code: "CHM-ANT-1L", price: 85.00 },
    { id: 6, category: "Medikal Cihaz", title: "Tansiyon Aleti", code: "DEV-BPM-1", price: 450.00 },
    { id: 7, category: "Sarf Malzeme", title: "Sargı Bezi 10cm", code: "BND-GZ-10", price: 8.50 },
    { id: 8, category: "Koruyucu Ekipman", title: "Tulum L Beden", code: "PRT-CVR-L", price: 65.00 },
    { id: 9, category: "Medikal Cihaz", title: "Pulse Oksimetre", code: "DEV-OXY-1", price: 150.00 },
    { id: 10, category: "Sarf Malzeme", title: "Enjektör 5cc", code: "INJ-5CC", price: 2.50 },
    { id: 11, category: "Koruyucu Ekipman", title: "Galoş (1000'li)", code: "PRT-GLS-1000", price: 120.00 },
    { id: 12, category: "Medikal Cihaz", title: "Nebulizatör", code: "DEV-NEB-1", price: 350.00 },
];
