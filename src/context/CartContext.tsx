import { useEffect, useState, type ReactNode } from "react";
import { CartContext, MAX_QTY_PER_PRODUCT, type CartItem, type AddToCartResult } from "./cart-context";

const STORAGE_KEY = "twhmu_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (
    product: { id: string; name: string; price: number; image_url: string | null; stock: number },
    quantity = 1
  ): AddToCartResult => {
    if (product.stock <= 0) {
      return { success: false, error: "This item is out of stock." };
    }

    const existing = items.find((i) => i.id === product.id);
    const newProductQuantity = (existing?.quantity ?? 0) + quantity;

    if (newProductQuantity > MAX_QTY_PER_PRODUCT) {
      return { success: false, error: `You can only add up to ${MAX_QTY_PER_PRODUCT} of this item.` };
    }

    if (newProductQuantity > product.stock) {
      return { success: false, error: `Only ${product.stock} left in stock.` };
    }

    if (existing) {
      setItems(items.map((i) => (i.id === product.id ? { ...i, quantity: newProductQuantity } : i)));
    } else {
      setItems([...items, { ...product, quantity }]);
    }

    return { success: true };
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) =>
      current.map((i) => {
        if (i.id !== id) return i;
        const max = Math.min(i.stock, MAX_QTY_PER_PRODUCT);
        return { ...i, quantity: Math.max(1, Math.min(quantity, max)) };
      })
    );
  };

  const removeFromCart = (id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, totalQuantity, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
