"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

type LoginUser = {
  email: string;
  name: string;
  role: string;
  initials: string;
};

export default function LoginPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const formId = useId();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const remember = data.get("remember") === "on";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await res.json()) as
        | { success: true; user: LoginUser; token: string }
        | { success: false; error: string };

      if (!res.ok || !payload.success) {
        setError(
          "success" in payload && !payload.success
            ? payload.error
            : "Sign-in failed. Please try again."
        );
        setSubmitting(false);
        return;
      }

      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem("carbon:user", JSON.stringify(payload.user));
      storage.setItem("carbon:token", payload.token);
      router.push("/dashboard");
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <aside
        className="relative bg-[var(--inverse-canvas)] text-[var(--inverse-ink)] px-8 py-16 lg:px-16 lg:py-24 flex"
        aria-label="Brand"
      >
        <div className="max-w-[480px] my-auto">
          <p className="text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--inverse-ink-muted)] mb-6">
            Intelligence Markets · Sign in
          </p>
          <h1
            className="text-[42px] sm:text-[60px] lg:text-[76px] leading-[1.17] tracking-[-0.5px] mb-8"
            style={{ fontWeight: 300 }}
          >
            Track every move the market makes.
          </h1>
          <p className="text-[18px] leading-[1.5] text-[var(--inverse-ink-muted)] mb-12 max-w-[420px]">
            Real-time quotes, AI-driven analysis, and portfolio intelligence —
            all powered by Carbon.
          </p>
        </div>
      </aside>

      <section
        className="bg-[var(--canvas)] text-[var(--ink)] px-8 py-16 lg:px-16 lg:py-24 flex"
        aria-label="Sign in"
      >
        <div className="w-full max-w-[480px] my-auto">
          <p className="text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--ink-muted)] mb-3">
            Sign in to Intelligence Markets
          </p>
          <h2
            className="text-[32px] leading-[1.25] tracking-normal text-[var(--ink)] mb-4"
            style={{ fontWeight: 400 }}
          >
            Access your portfolio
          </h2>
          <p className="text-[16px] leading-[1.5] tracking-[0.16px] text-[var(--ink-muted)] mb-10 max-w-[420px]">
            Sign in to view your watchlists, track performance, and get
            actionable market insights.
          </p>

          <form id={formId} onSubmit={onSubmit} className="w-full" noValidate>
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor={emailId} className="carbon-label mb-2">
                  Email
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  className="carbon-input"
                  aria-invalid="false"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor={passwordId} className="carbon-label">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    className="link-ibm text-[14px] leading-[1.29] tracking-[0.16px]"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="carbon-input pr-14"
                    aria-invalid="false"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn-ghost !min-h-0 !px-3 !py-2 text-[14px]"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label
                htmlFor={rememberId}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  id={rememberId}
                  name="remember"
                  type="checkbox"
                  className="checkbox-carbon"
                />
                <span className="text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--ink)]">
                  Keep me signed in on this device
                </span>
              </label>

              {error && (
                <div
                  role="alert"
                  className="px-4 py-3 border border-[var(--semantic-error)] bg-[var(--surface-1)] text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--semantic-error)]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={submitting}
              >
                {submitting ? "Signing in…" : "Sign in"}
                {!submitting && <ArrowRight />}
              </button>

              <p
                id={`${formId}-status`}
                className="text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--ink-muted)]"
                role="status"
                aria-live="polite"
              >
                By signing in you agree to the Terms of Use and Privacy notice.
              </p>
            </div>
          </form>

          <div className="mt-10 p-4 border border-[var(--hairline)] bg-[var(--surface-1)]">
            <p className="text-[12px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)] mb-2">
              Demo credentials
            </p>
            <ul className="text-[14px] leading-[1.5] tracking-[0.16px] text-[var(--ink-muted)] font-mono">
              <li>admin@carbon.cloud / carbon2024</li>
              <li>demo@carbon.cloud / demo1234</li>
            </ul>
          </div>

          <p className="mt-8 text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--ink-muted)]">
            Don&apos;t have an account?{" "}
            <a href="#signup" className="link-ibm">
              Create one
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11 4l5 6-5 6M16 10H4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
