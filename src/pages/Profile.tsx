import { useAuth } from "../context/useAuth";
import { useAuthModal } from "../context/useAuthModal";

const sidebarLinks = ["Profile", "Orders", "My Tickets", "Wishlist", "Addresses", "Notifications"];

const upcomingTickets = [
  { date: "Jun 05", event: "New York · Floor GA ×2", venue: "Brooklyn Steel" },
  { date: "Jul 24", event: "Nashville · Mezzanine ×1", venue: "Ryman Auditorium" },
  { date: "Aug 21", event: "Los Angeles · VIP ×1", venue: "The Wiltern" },
];

const orderHistory: { id: string; date: string; item: string; price: string; status: "Delivered" | "Confirmed" }[] = [
  { id: "#1042", date: "May 10", item: "Tour Tee · Hoodie", price: "$110", status: "Delivered" },
  { id: "#1038", date: "May 02", item: "Tickets · NYC ×2", price: "$190", status: "Confirmed" },
  { id: "#1031", date: "Apr 22", item: "Vinyl + Poster", price: "$50", status: "Delivered" },
  { id: "#1019", date: "Apr 03", item: "Cap · Embroidered", price: "$32", status: "Delivered" },
];

const statusClass: Record<string, string> = {
  Delivered: "border-aqua-deep text-aqua",
  Confirmed: "border-coral-deep text-coral",
};

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const { openAuth } = useAuthModal();

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
            {sidebarLinks.map((label) => (
              <span
                key={label}
                className={`font-mono text-[11px] tracking-[0.16em] uppercase py-2.5 border-l-2 pl-4 ${
                  label === "Profile" ? "text-aqua border-aqua" : "text-ink-dim border-transparent"
                }`}
              >
                {label}
              </span>
            ))}
            <button
              type="button"
              onClick={() => signOut()}
              className="text-left font-mono text-[11px] tracking-[0.16em] uppercase py-2.5 pl-4 border-l-2 border-transparent text-ink-dim hover:text-coral transition-colors duration-200"
            >
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main */}
        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            Account · Profile
          </span>
          <h1 className="font-display font-extrabold text-[clamp(36px,5vw,64px)] leading-[0.98] tracking-[-0.01em] text-ink m-0 mb-10">
            Hello, <em className="italic font-semibold text-coral">{displayName}</em>.
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { label: "Tickets", value: `${upcomingTickets.length} upcoming` },
              { label: "Orders", value: String(orderHistory.length) },
              { label: "Wishlist", value: "6" },
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

          <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-4">
            Upcoming · {upcomingTickets.length} tickets
          </h2>
          <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-14">
            {upcomingTickets.map((t) => (
              <li
                key={t.date}
                className="flex items-center justify-between gap-4 border border-aqua-deep px-5 py-4 flex-wrap"
              >
                <div className="flex items-center gap-5">
                  <span className="font-display text-xl text-aqua w-16 shrink-0">{t.date}</span>
                  <div>
                    <div className="text-ink text-[15px]">{t.event}</div>
                    <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint">
                      {t.venue}
                    </span>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-[1.5px] border-aqua text-aqua text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg">
                  View ›
                </button>
              </li>
            ))}
          </ul>

          <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-4">
            Order history · last {orderHistory.length}
          </h2>
          <ul className="list-none m-0 p-0 border-t border-stroke">
            {orderHistory.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-4 py-4 border-b border-stroke flex-wrap"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono text-[11px] text-ink-faint">{o.id}</span>
                  <span className="font-mono text-[11px] text-ink-faint">{o.date}</span>
                  <span className="text-ink text-[15px]">{o.item}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-aqua">{o.price}</span>
                  <span
                    className={`inline-flex px-[11px] py-[5px] border font-mono text-[10px] tracking-[0.12em] uppercase ${statusClass[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
