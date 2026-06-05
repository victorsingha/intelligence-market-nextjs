"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  email: string;
  name: string;
  role: string;
  initials: string;
};

const USER_KEY = "carbon:user";
const TOKEN_KEY = "carbon:token";
const AUTH_EVENT = "carbon:auth";

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12"
      aria-hidden="true" focusable="false"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 80ms" }}
    >
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  function onLogout() {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
    window.location.href = "/";
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 btn-ghost !min-h-0 !py-1 !px-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          className="w-8 h-8 inline-flex items-center justify-center bg-[var(--ink)] text-[var(--on-primary)] text-[12px] font-semibold tracking-[0.32px]"
          aria-hidden="true"
        >
          {user.initials}
        </span>
        <span className="hidden sm:inline text-[14px] text-[var(--ink)]">
          {user.name}
        </span>
        <Caret open={open} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 min-w-[220px] bg-[var(--canvas)] border border-[var(--hairline-strong)] z-10"
        >
          <div className="px-4 py-3 border-b border-[var(--hairline)]">
            <p className="text-[14px] text-[var(--ink)]">{user.name}</p>
            <p className="text-[12px] text-[var(--ink-muted)] mt-0.5">{user.email}</p>
          </div>
          <Link href="#profile" role="menuitem" className="block px-4 py-3 text-[14px] text-[var(--ink)] hover:bg-[var(--surface-1)]">
            Profile
          </Link>
          <Link href="#settings" role="menuitem" className="block px-4 py-3 text-[14px] text-[var(--ink)] hover:bg-[var(--surface-1)]">
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="w-full text-left px-4 py-3 text-[14px] text-[var(--primary)] hover:bg-[var(--surface-1)] border-t border-[var(--hairline)]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw =
      window.localStorage.getItem(USER_KEY) ??
      window.sessionStorage.getItem(USER_KEY);
    queueMicrotask(() => {
      if (raw) {
        try { setUser(JSON.parse(raw) as User); } catch {}
      }
    });

    function onAuthChange() {
      const raw =
        window.localStorage.getItem(USER_KEY) ??
        window.sessionStorage.getItem(USER_KEY);
      queueMicrotask(() => {
        if (!raw) { setUser(null); return; }
        try { setUser(JSON.parse(raw)); } catch { setUser(null); }
      });
    }
    window.addEventListener("storage", onAuthChange);
    window.addEventListener(AUTH_EVENT, onAuthChange);
    return () => {
      window.removeEventListener("storage", onAuthChange);
      window.removeEventListener(AUTH_EVENT, onAuthChange);
    };
  }, []);

  return (
    <header className="topbar flex items-center px-6 border-b border-[var(--hairline)]">
      <div className="max-w-[1200px] mx-auto w-full flex items-center">
        <span className="text-[14px] font-semibold tracking-[0.16px] text-[var(--ink)]">Intelligence Markets</span>
        <nav className="ml-auto flex items-center gap-2" aria-label="Primary">
          <Link
            href="/news"
            className="btn-ghost !min-h-0 !py-1.5 !px-3 text-[13px]"
          >
            News
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost !min-h-0 !py-1.5 !px-3 text-[13px]"
          >
            Dashboard
          </Link>
        </nav>
        {user && <div className="ml-4"><UserMenu user={user} /></div>}
      </div>
    </header>
  );
}
