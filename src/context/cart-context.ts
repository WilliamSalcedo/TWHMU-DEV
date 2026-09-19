import { createContext } from "react";

// Max units of a single product allowed in the cart — not a total cart cap.
export const MAX_QTY_PER_PRODUCT = 4;

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  quantity: number;
};

export type AddToCartResult = { success: true } | { success: false; error: string };

export type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  addToCart: (product: { id: string; name: string; price: number; image_url: string | null; stock: number }, quantity?: number) => AddToCartResult;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);
