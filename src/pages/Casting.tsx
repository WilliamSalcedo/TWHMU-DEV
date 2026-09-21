import { useState, type FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import { useAuthModal } from "../context/useAuthModal";
import { submitCastingApplication } from "../services/casting";
import { withProtocol } from "../utils/url";

const inputClass =
  "w-full px-5 py-3.5 bg-transparent border border-stroke-hi text-ink text-[15px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none focus:border-aqua";

const roles = ["Vocalist", "Dancer / Ensemble", "Actor", "Crew / Technical", "Other"];

export default function Casting() {
  const { user } = useAuth();
  const { openAuth } = useAuthModal();

  const [fullName, setFullName] = useState(user?.user_metadata?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [roleInterest, setRoleInterest] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const formValid = fullName.trim() && email.trim() && phone.trim() && roleInterest && experience.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!user) {
      openAuth("signin");
      return;
    }

    if (!formValid) return;

    setSending(true);

    const result = await submitCastingApplication(user.id, {
      full_name: fullName,
      email,
      phone,
      role_interest: roleInterest,
      experience,
      portfolio_url: portfolioUrl.trim() ? withProtocol(portfolioUrl.trim()) : null,
      message: message.trim() || null,
    });

    setSending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-bg">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full border border-aqua flex items-center justify-center text-aqua text-3xl">
          ✓
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
          Application received
        </span>
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Thank you, <em className="italic text-coral">{fullName.split(" ")[0] || "friend"}</em>.
        </h1>
        <p className="text-[15px] text-ink-dim max-w-[44ch]">
          Your casting application has been submitted. The production team reviews every submission. We'll reach out at {email} if there's a fit.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[720px] mx-auto">

        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
          Join the show
        </span>
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] leading-[0.98] tracking-[-0.01em] text-ink m-0 mb-4">
          Casting <em className="italic text-coral">call</em>.
        </h1>
        <p className="text-[15px] leading-[1.65] text-ink-dim max-w-[56ch] mb-10">
          We're always looking for vocalists, dancers, actors and crew to join the tour. Tell us about yourself below —
          submitting an application requires a free account so we can follow up with you directly.
        </p>

        {!user && (
          <div className="p-6 mb-10 bg-bg-raised border border-aqua-deep">
            <p className="text-[15px] text-ink-dim mb-4">Sign in to submit a casting application.</p>
            <button
              type="button"
              onClick={() => openAuth("signin")}
              className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
            >
              Sign in
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className={`${inputClass} sm:col-span-2`} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className={inputClass} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={inputClass} />
          </div>

          <select
            value={roleInterest}
            onChange={(e) => setRoleInterest(e.target.value)}
            className={`${inputClass} ${roleInterest ? "text-ink" : "text-ink-faint"}`}
          >
            <option value="" disabled>
              Role you're interested in
            </option>
            {roles.map((r) => (
              <option key={r} value={r} className="text-ink bg-bg-raised">
                {r}
              </option>
            ))}
          </select>

          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Tell us about your experience"
            rows={4}
            className={inputClass}
          />

          <input
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="Portfolio / reel link (optional)"
            className={inputClass}
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything else you'd like us to know (optional)"
            rows={3}
            className={inputClass}
          />

          {submitted && !formValid && (
            <p className="font-mono text-[11px] text-coral">Please fill in your name, email, phone, role and experience.</p>
          )}
          {error && <p className="font-mono text-[11px] text-coral">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className="self-start mt-2 inline-flex items-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </section>
  );
}
