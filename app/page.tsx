import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-bl from-[var(--primary)]/5 to-transparent rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-[var(--primary)]/3 to-transparent rounded-full" />
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
          viewBox="0 0 800 800"
          fill="none"
        >
          <rect x="0" y="0" width="800" height="800" />
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0" y1={i * 40} x2="800" y2={i * 40}
              stroke="currentColor" strokeWidth="1"
            />
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 40} y1="0" x2={i * 40} y2="800"
              stroke="currentColor" strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-[720px] w-full text-center">
          <p className="text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--primary)] font-semibold mb-6">
            Intelligent stock analysis platform
          </p>
          <h1
            className="text-[48px] sm:text-[72px] lg:text-[88px] leading-[1.12] tracking-[-0.5px] text-[var(--ink)] mb-6"
            style={{ fontWeight: 300 }}
          >
            Market intelligence
            <span className="block text-[var(--primary)]">for every move.</span>
          </h1>
          <p className="text-[18px] leading-[1.6] text-[var(--ink-muted)] mb-10 max-w-[520px] mx-auto">
            Track real-time prices, analyze portfolios, and discover opportunities
            with AI-driven insights — all in one place.
          </p>
          <Link
            href="/login"
            className="btn-primary text-[16px] !px-10 !py-[14px] inline-flex items-center gap-3 mx-auto"
          >
            Sign in to Intelligence Markets
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
          </Link>
          <p className="mt-8 text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--ink-subtle)]">
            Demo: <span className="font-mono text-[var(--ink-muted)]">admin@carbon.cloud / carbon2024</span>
          </p>
        </div>
      </main>
    </div>
  );
}


