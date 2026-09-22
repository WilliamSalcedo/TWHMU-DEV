import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider } from "../context/CartContext";
import { useCart } from "../context/useCart";
import { MAX_QTY_PER_PRODUCT, type AddToCartInput } from "../context/cart-context";

const product: AddToCartInput = { id: "p1", type: "product", name: "Test Tee", price: 20, image_url: null, stock: 10 };

function renderCart() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds a new item to the cart", () => {
    const { result } = renderCart();

    act(() => {
      const outcome = result.current.addToCart(product, 1);
      expect(outcome.success).toBe(true);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalQuantity).toBe(1);
  });

  it(`rejects adding more than ${MAX_QTY_PER_PRODUCT} of the same item`, () => {
    const { result } = renderCart();

    act(() => {
      result.current.addToCart(product, MAX_QTY_PER_PRODUCT);
    });

    let outcome: { success: boolean } | undefined;
    act(() => {
      outcome = result.current.addToCart(product, 1);
    });

    expect(outcome?.success).toBe(false);
    expect(result.current.items[0].quantity).toBe(MAX_QTY_PER_PRODUCT);
  });

  it("rejects adding an out-of-stock item", () => {
    const { result } = renderCart();
    const outOfStock: AddToCartInput = { ...product, id: "p2", stock: 0 };

    let outcome: { success: boolean } | undefined;
    act(() => {
      outcome = result.current.addToCart(outOfStock, 1);
    });

    expect(outcome?.success).toBe(false);
    expect(result.current.items).toHaveLength(0);
  });

  it("rejects adding more units than are in stock, even under the per-product max", () => {
    const { result } = renderCart();
    const lowStock: AddToCartInput = { ...product, id: "p2", stock: 2 };

    let outcome: { success: boolean } | undefined;
    act(() => {
      outcome = result.current.addToCart(lowStock, 3);
    });

    expect(outcome?.success).toBe(false);
    expect(result.current.items).toHaveLength(0);
  });

  it("lets two different products each reach the max independently (not a shared cart-wide cap)", () => {
    const { result } = renderCart();
    const productB: AddToCartInput = { ...product, id: "p2", name: "Hoodie" };

    act(() => {
      result.current.addToCart(product, MAX_QTY_PER_PRODUCT);
    });
    act(() => {
      result.current.addToCart(productB, MAX_QTY_PER_PRODUCT);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalQuantity).toBe(MAX_QTY_PER_PRODUCT * 2);
  });

  it("clamps updateQuantity within stock and the per-product max", () => {
    const { result } = renderCart();

    act(() => {
      result.current.addToCart(product, 1);
    });
    act(() => {
      result.current.updateQuantity(product.id, 99);
    });

    expect(result.current.items[0].quantity).toBe(Math.min(product.stock, MAX_QTY_PER_PRODUCT));
  });

  it("updateQuantity never drops below 1", () => {
    const { result } = renderCart();

    act(() => {
      result.current.addToCart(product, 2);
    });
    act(() => {
      result.current.updateQuantity(product.id, 0);
    });

    expect(result.current.items[0].quantity).toBe(1);
  });

  it("removeFromCart removes only the targeted item", () => {
    const { result } = renderCart();
    const productB: AddToCartInput = { ...product, id: "p2", name: "Hoodie" };

    act(() => {
      result.current.addToCart(product, 1);
    });
    act(() => {
      result.current.addToCart(productB, 1);
    });
    act(() => {
      result.current.removeFromCart(product.id);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(productB.id);
  });

  it("clearCart empties everything", () => {
    const { result } = renderCart();
    const productB: AddToCartInput = { ...product, id: "p2" };

    act(() => {
      result.current.addToCart(product, 1);
    });
    act(() => {
      result.current.addToCart(productB, 1);
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalQuantity).toBe(0);
  });

  it("persists the cart to localStorage", () => {
    const { result } = renderCart();

    act(() => {
      result.current.addToCart(product, 2);
    });

    const stored = JSON.parse(localStorage.getItem("twhmu_cart") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].quantity).toBe(2);
  });
});
