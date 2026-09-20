import { supabase } from "../supabaseClient";
import type { CartItem } from "../context/cart-context";
import type { OrderRow } from "../types/database";

export type ShippingDetails = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type CreateOrderInput = {
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: "card" | "cash" | "other";
  shipping: ShippingDetails;
};

type CreateOrderResult = { success: true; orderId: string } | { success: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      status: "confirmed",
      total: input.total,
      payment_method: input.paymentMethod,
      customer_name: input.shipping.customerName,
      customer_email: input.shipping.customerEmail,
      customer_phone: input.shipping.customerPhone,
      shipping_address: input.shipping.address,
      shipping_city: input.shipping.city,
      shipping_region: input.shipping.region,
      shipping_postal_code: input.shipping.postalCode,
      shipping_country: input.shipping.country,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError?.message);
    return { success: false, error: "Couldn't place your order. Please try again." };
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    item_type: item.type,
    product_id: item.type === "product" ? item.id : null,
    tour_date_id: item.type === "ticket" ? item.id : null,
    item_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError.message);
    return { success: false, error: "Couldn't save your order items. Please try again." };
  }

  return { success: true, orderId: order.id };
}

export async function getOrdersForUser(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error.message);
    return [];
  }

  return data ?? [];
}
