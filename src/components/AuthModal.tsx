import { useEffect, useState, type FormEvent } from "react";
import { registerUser, signIn } from "../services/auth";
import type { AuthMode } from "../context/auth-modal-context";

type Props = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
};

type Errors = { name?: string; email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode: AuthMode, values: { name: string; email: string; password: string }): Errors {
  const errors: Errors = {};

  if (mode === "register" && values.name.trim().length < 2) {
    errors.name = "Enter your name";
  }

  if (!values.email.trim()) {
    errors.email = "Enter your email";
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = "Enter a valid email";
  }

  if (!values.password) {
    errors.password = "Enter your password";
  } else if (mode === "register" && values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}

function AuthForm({ mode, onClose, onSwitchMode }: Omit<Props, "open">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registered, setRegistered] = useState(false);

  const errors = validate(mode, { name, email, password });
  const showError = (field: keyof Errors) => (touched[field] || submitted) && errors[field];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitError("");

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    const result =
      mode === "register" ? await registerUser(name, email, password) : await signIn(email, password);

    setLoading(false);

    if (!result.success) {
      setSubmitError(result.error ?? "Something went wrong");
      return;
    }

    if (mode === "register") {
      setRegistered(true);
      return;
    }

    onClose();
  };

  const inputClass = (field: keyof Errors) =>
    `w-full px-5 py-3.5 bg-transparent border text-ink text-[15px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none ${
      showError(field) ? "border-coral" : "border-stroke-hi focus:border-aqua"
    }`;

  if (registered) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-6 w-14 h-14 rounded-full border border-aqua flex items-center justify-center text-aqua text-2xl">
          ✓
        </div>
        <h2 id="auth-modal-title" className="font-display font-extrabold text-[clamp(28px,4vw,36px)] leading-[0.98] text-aqua m-0 mb-3">
          Registration successful
        </h2>
        <p className="text-[15px] leading-[1.65] text-ink-dim max-w-[36ch] mx-auto mb-8">
          Your account has been created. Check your email to confirm it, then sign in.
        </p>
        <button
          type="button"
          onClick={() => onSwitchMode("signin")}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-6 border-b border-stroke mb-8">
        {(["signin", "register"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSwitchMode(m)}
            className={`pb-3 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 border-b-2 -mb-px ${
              mode === m ? "text-aqua border-aqua" : "text-ink-dim border-transparent hover:text-ink"
            }`}
          >
            {m === "signin" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      <h2 id="auth-modal-title" className="font-display font-extrabold text-[clamp(30px,4vw,40px)] leading-[0.98] text-aqua m-0">
        {mode === "signin" ? "Welcome back," : "Join the sisterhood."}
      </h2>
      <p className="font-display italic text-coral text-lg mt-2 mb-8">
        {mode === "signin" ? "the stage is waiting." : "get in before the doors open."}
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {mode === "register" && (
          <div>
            <label htmlFor="auth-name" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-2 inline-block">
              Name
            </label>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className={inputClass("name")}
              placeholder="Your name"
            />
            {showError("name") && <p className="font-mono text-[11px] text-coral mt-1.5">{errors.name}</p>}
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-2 inline-block">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={inputClass("email")}
            placeholder="you@example.com"
          />
          {showError("email") && <p className="font-mono text-[11px] text-coral mt-1.5">{errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="auth-password" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim">
              Password{mode === "register" && " · 8+ chars"}
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-dim hover:text-aqua"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            className={inputClass("password")}
            placeholder="••••••••"
          />
          {showError("password") && <p className="font-mono text-[11px] text-coral mt-1.5">{errors.password}</p>}
        </div>

        {submitError && <p className="font-mono text-[11px] text-coral mt-1.5">{submitError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-dim mt-6">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button type="button" onClick={() => onSwitchMode("register")} className="text-aqua underline decoration-dashed underline-offset-4 hover:text-aqua-hi">
              Create an account
            </button>
          </>
        ) : (
          <>
            Already a member?{" "}
            <button type="button" onClick={() => onSwitchMode("signin")} className="text-aqua underline decoration-dashed underline-offset-4 hover:text-aqua-hi">
              Sign in
            </button>
          </>
        )}
      </p>
    </>
  );
}

export default function AuthModal({ open, mode, onClose, onSwitchMode }: Props) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[460px] max-h-[90vh] overflow-y-auto bg-bg-raised border border-stroke p-7 sm:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-ink-dim hover:text-ink text-xl leading-none transition-colors duration-200"
        >
          ×
        </button>

        <AuthForm key={mode} mode={mode} onClose={onClose} onSwitchMode={onSwitchMode} />
      </div>
    </div>
  );
}
