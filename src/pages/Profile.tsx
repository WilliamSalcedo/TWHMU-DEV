import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import { useAuthModal } from "../context/useAuthModal";
import { getOrdersForUser } from "../services/orders";
import { getAddresses, createAddress, deleteAddress, type NewAddress } from "../services/addresses";
import type { OrderRow, OrderItemRow, AddressRow } from "../types/database";

type Tab = "profile" | "orders" | "tickets" | "addresses";

const statusClass: Record<OrderRow["status"], string> = {
  confirmed: "border-aqua-deep text-aqua",
  pending: "border-coral-deep text-coral",
  cancelled: "border-ink-faint text-ink-faint",
};

function FilteredOrderRow({ order, itemType }: { order: OrderRow; itemType: OrderItemRow["item_type"] }) {
  const [open, setOpen] = useState(false);
  const items = order.order_items.filter((i) => i.item_type === itemType);
  if (items.length === 0) return null;

  const shownTotal = items.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0);
  const date = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <li className="border-b border-stroke">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 flex-wrap text-left bg-transparent border-none cursor-pointer"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-mono text-[11px] text-ink-faint">#{order.id.slice(0, 8)}</span>
          <span className="font-mono text-[11px] text-ink-faint">{date}</span>
          <span className="text-ink text-[15px]">
            {items.length} item{items.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-display text-aqua">${shownTotal.toFixed(2)}</span>
          <span
            className={`inline-flex px-[11px] py-[5px] border font-mono text-[10px] tracking-[0.12em] uppercase ${statusClass[order.status]}`}
          >
            {order.status}
          </span>
          <span className="text-ink-faint">{open ? "−" : "+"}</span>
        </div>
      </button>

      {open && (
        <div className="pb-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-3">Items</h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-[14px]">
                  <span className="text-ink-dim">
                    {item.item_name} ×{item.quantity}
                  </span>
                  <span className="text-ink shrink-0">${(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          {itemType === "product" ? (
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-3">Shipping & payment</h3>
              <p className="text-[14px] text-ink-dim leading-[1.6] m-0">
                {order.customer_name}
                <br />
                {order.shipping_address}
                <br />
                {order.shipping_city}, {order.shipping_region} {order.shipping_postal_code}
                <br />
                {order.shipping_country}
                <br />
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint">
                  Paid via {order.payment_method}
                </span>
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-3">Order info</h3>
              <p className="text-[14px] text-ink-dim leading-[1.6] m-0">
                {order.customer_name}
                <br />
                <span className="text-ink-faint">{order.customer_email}</span>
                <br />
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint">
                  Paid via {order.payment_method}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function OrdersTab({ orders, loading, itemType, emptyLabel }: { orders: OrderRow[]; loading: boolean; itemType: OrderItemRow["item_type"]; emptyLabel: string }) {
  if (loading) {
    return <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-6">Loading…</p>;
  }

  const hasAny = orders.some((o) => o.order_items.some((i) => i.item_type === itemType));

  if (!hasAny) {
    return <p className="text-[15px] text-ink-dim">{emptyLabel}</p>;
  }

  return (
    <ul className="list-none m-0 p-0 border-t border-stroke">
      {orders.map((order) => (
        <FilteredOrderRow key={order.id} order={order} itemType={itemType} />
      ))}
    </ul>
  );
}

const addressInputClass =
  "w-full px-4 py-3 bg-transparent border border-stroke-hi text-ink text-[14px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none focus:border-aqua";

function AddressesTab({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewAddress>({
    label: "Home",
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    region: "",
    postal_code: "",
    country: "",
  });

  const load = (showLoading = false) => {
    if (showLoading) setLoading(true);
    getAddresses().then((rows) => {
      setAddresses(rows);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAddresses().then((rows) => {
      setAddresses(rows);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const created = await createAddress(userId, { ...form, is_default: addresses.length === 0 });
    setSaving(false);
    if (created) {
      setShowForm(false);
      setForm({ label: "Home", full_name: "", phone: "", address_line: "", city: "", region: "", postal_code: "", country: "" });
      load();
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteAddress(id);
    if (ok) load();
  };

  if (loading) {
    return <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-6">Loading…</p>;
  }

  return (
    <div>
      {addresses.length === 0 && !showForm && (
        <p className="text-[15px] text-ink-dim mb-6">No saved addresses yet. Add one to speed up checkout.</p>
      )}

      <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-6">
        {addresses.map((a) => (
          <li key={a.id} className="flex items-start justify-between gap-4 border border-stroke px-5 py-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-aqua">{a.label}</span>
                {a.is_default && (
                  <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-coral border border-coral-deep px-1.5 py-0.5">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[14px] text-ink-dim leading-[1.6] m-0">
                {a.full_name}
                <br />
                {a.address_line}, {a.city}, {a.region} {a.postal_code}
                <br />
                {a.country} · {a.phone}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(a.id)}
              className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint hover:text-coral transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {showForm ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 border border-stroke-hi">
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label (Home, Work...)" className={`${addressInputClass} sm:col-span-2`} required />
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" className={addressInputClass} required />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={addressInputClass} required />
          <input value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} placeholder="Address" className={`${addressInputClass} sm:col-span-2`} required />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className={addressInputClass} required />
          <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="State / Region" className={addressInputClass} required />
          <input value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} placeholder="Postal code" className={addressInputClass} required />
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className={addressInputClass} required />
          <div className="sm:col-span-2 flex items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-[11px] tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-ink bg-transparent border-none cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-[11px] tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
        >
          + Add address
        </button>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const { openAuth } = useAuthModal();
  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrdersForUser().then((rows) => {
      setOrders(rows);
      setOrdersLoading(false);
    });
  }, [user]);

  if (loading) {
    return <section className="min-h-[70vh]" />;
  }

  if (!user) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
          Account
        </span>
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Sign in to view your profile
        </h1>
        <p className="text-[15px] text-ink-dim mb-8 max-w-[40ch]">
          Track your tickets, orders and everything else tied to your account.
        </p>
        <button
          type="button"
          onClick={() => openAuth("signin")}
          className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
        >
          Sign in
        </button>
      </section>
    );
  }

  const displayName: string = user.user_metadata?.name || user.email || "";
  const initial = displayName ? displayName[0].toUpperCase() : "";
  const memberSince = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();
  const ticketCount = orders.reduce(
    (sum, o) => sum + o.order_items.filter((i) => i.item_type === "ticket").reduce((s, i) => s + i.quantity, 0),
    0
  );
  const productOrderCount = orders.filter((o) => o.order_items.some((i) => i.item_type === "product")).length;

  const navItems: { key: Tab | "notifications"; label: string; disabled?: boolean }[] = [
    { key: "profile", label: "Profile" },
    { key: "orders", label: "Orders" },
    { key: "tickets", label: "My Tickets" },
    { key: "addresses", label: "Addresses" },
    { key: "notifications", label: "Notifications", disabled: true },
  ];

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">

        {/* Sidebar */}
        <aside>
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-stroke">
            <span className="w-12 h-12 rounded-full border border-aqua flex items-center justify-center text-aqua text-xl font-display italic shrink-0">
              {initial}
            </span>
            <div>
              <div className="font-display text-lg text-ink">{displayName}</div>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-coral">Member</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                disabled={item.disabled}
                onClick={() => !item.disabled && setTab(item.key as Tab)}
                className={`text-left font-mono text-[11px] tracking-[0.16em] uppercase py-2.5 border-l-2 pl-4 bg-transparent border-t-0 border-r-0 border-b-0 transition-colors duration-200 ${
                  item.disabled
                    ? "text-ink-faint/50 cursor-not-allowed border-transparent"
                    : tab === item.key
                      ? "text-aqua border-aqua cursor-pointer"
                      : "text-ink-dim border-transparent hover:text-ink cursor-pointer"
                }`}
              >
                {item.label}
                {item.disabled && <span className="ml-1.5 normal-case">(soon)</span>}
              </button>
            ))}
            <button
              type="button"
              onClick={() => signOut()}
              className="text-left font-mono text-[11px] tracking-[0.16em] uppercase py-2.5 pl-4 border-l-2 border-transparent text-ink-dim hover:text-coral transition-colors duration-200 bg-transparent border-t-0 border-r-0 border-b-0 cursor-pointer"
            >
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main */}
        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            Account · {navItems.find((n) => n.key === tab)?.label}
          </span>
          <h1 className="font-display font-extrabold text-[clamp(36px,5vw,64px)] leading-[0.98] tracking-[-0.01em] text-ink m-0 mb-10">
            Hello, <em className="italic font-semibold text-coral">{displayName}</em>.
          </h1>

          {tab === "profile" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
              {[
                { label: "Product orders", value: String(productOrderCount) },
                { label: "Tickets purchased", value: String(ticketCount) },
                { label: "Member since", value: String(memberSince) },
              ].map((stat) => (
                <div key={stat.label} className="border border-stroke p-4">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint">
                    {stat.label}
                  </span>
                  <div className="font-display text-2xl text-aqua mt-1">{stat.value}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "orders" && (
            <OrdersTab orders={orders} loading={ordersLoading} itemType="product" emptyLabel="No product orders yet." />
          )}

          {tab === "tickets" && (
            <OrdersTab orders={orders} loading={ordersLoading} itemType="ticket" emptyLabel="No tickets purchased yet." />
          )}

          {tab === "addresses" && <AddressesTab userId={user.id} />}
        </div>

      </div>
    </section>
  );
}
